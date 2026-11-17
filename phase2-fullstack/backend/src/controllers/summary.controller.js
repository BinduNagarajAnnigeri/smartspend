import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { getMonthDateRange } from "../utils/month.js";
import { CATEGORY_TYPE } from "../constants/categoryTypes.js";
import { getCategoryTotals } from "../utils/category-summary.js";
import { getBudgetSummaryList } from "../utils/budget-summary.js";

export const getMonthlySummary = async (req, res) => {
  const month = req.validatedQuery.month; //or { month } = req.validatedQuery

  const { start, end } = getMonthDateRange(month);

  //aggregate needs a real ObjectId, and find doesn’t(in find we just use req.userId).
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.userId),
        date: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: "$type",
        totalAmount: {
          $sum: "$amount",
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const incomeData = result.find((item) => item._id === CATEGORY_TYPE.INCOME);
  const expenseData = result.find((item) => item._id === CATEGORY_TYPE.EXPENSE);

  const income = incomeData?.totalAmount ?? 0;
  const expense = expenseData?.totalAmount ?? 0;

  const incomeCount = incomeData?.count ?? 0;
  const expenseCount = expenseData?.count ?? 0;

  return res.status(200).json({
    message: "Monthly summary fetched successfully",
    income,
    expense,
    balance: income - expense,
    incomeCount,
    expenseCount,
    transactionCount: incomeCount + expenseCount,
  });
};

export const getCategorySummary = async (req, res) => {
  const { month, type } = req.validatedQuery;

  const result = await getCategoryTotals(req.userId, month, type);

  const total = result.reduce((sum, item) => sum + item.totalAmount, 0);

  const list = result.map((item) => ({
    ...item,
    percentage:
      total === 0 ? 0 : Number(((item.totalAmount / total) * 100).toFixed(2)),
  }));

  return res.status(200).json({
    message: "Category summary fetched successfully",
    month,
    total,
    list,
  });
};

export const getBudgetSummary = async (req, res) => {
  const month = req.validatedQuery.month;
  const user = req.userId;

  const list = await getBudgetSummaryList(user, month);
  return res
    .status(200)
    .json({ message: "Budget summary fetched", month, list });
};

export const getAlerts = async (req, res) => {
  const month = req.validatedQuery.month;
  const summaryList = await getBudgetSummaryList(req.userId, month);

  const list = summaryList
    .filter(
      (item) => item.status === "OVER_LIMIT" || item.status === "NEAR_LIMIT",
    )
    .map((item) => {
      let message;
      const category = item.category.name;
      if (item.status === "OVER_LIMIT") {
        const exceededAmount = Math.abs(item.remaining);

        message = `${category} is over budget by ${(exceededAmount / 100).toFixed(2)}`;
      } else {
        message = `${category} has used ${item.percentUsed}% of its budget`;
      }
      return {
        category: item.category,
        status: item.status,
        spent: item.spent,
        limitAmount: item.limitAmount,
        percentUsed: item.percentUsed,
        message,
      };
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "OVER_LIMIT" ? -1 : 1;
      }
      return b.percentUsed - a.percentUsed; ////Negative value: a comes before b. Positive value: b comes before a.
    });

  return res.status(200).json({
    message: "Alerts fetched successfully",
    month,
    count: list.length,
    list,
  });
};
