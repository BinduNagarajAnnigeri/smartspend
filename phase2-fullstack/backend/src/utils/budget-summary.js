import Budget from "../models/budget.model.js";
import { getCategoryTotals } from "./category-summary.js";
import { CATEGORY_TYPE } from "../constants/categoryTypes.js";

const LIMIT_PERCENT = 80;

export const getBudgetSummaryList = async (user, month) => {
  const budgets = await Budget.find({ user, month })
    .populate("category", "name color")
    .sort({ category: 1 })
    .lean();
  const spent = await getCategoryTotals(user, month, CATEGORY_TYPE.EXPENSE);

  const spentMap = new Map();

  for (const item of spent) {
    spentMap.set(item.category._id.toString(), item);
  }

  const list = budgets.map((budget) => {
    const categoryId = budget.category._id;

    const spentData = spentMap.get(categoryId.toString());

    const spentAmount = spentData?.totalAmount ?? 0;
    const limitAmount = budget.limitAmount;

    const remaining = limitAmount - spentAmount;
    const percentUsed = Number(((spentAmount / limitAmount) * 100).toFixed(2));
    let status = "OK";

    if (percentUsed > 100) {
      status = "OVER_LIMIT";
    } else if (percentUsed >= LIMIT_PERCENT) {
      status = "NEAR_LIMIT";
    }

    spentMap.delete(categoryId.toString());
    return {
      category: {
        _id: categoryId,
        name: budget.category.name,
        color: budget.category.color,
      },
      limitAmount,
      spent: spentAmount,
      remaining,
      percentUsed,
      status,
    };
  });

  for (const item of spentMap.values()) {
    list.push({
      category: item.category,
      limitAmount: null,
      spent: item.totalAmount,
      remaining: null,
      percentUsed: null,
      status: "NO_BUDGET",
    });
  }

  return list;
};
