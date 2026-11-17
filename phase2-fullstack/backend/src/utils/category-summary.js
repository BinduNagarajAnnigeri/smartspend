import Transaction from "../models/transaction.model.js";
import Category from "../models/category.model.js";
import { getMonthDateRange } from "./month.js";
import mongoose from "mongoose";

export const getCategoryTotals = async (userId, month, type) => {
  const { start, end } = getMonthDateRange(month);

  return Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type,
        date: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        totalAmount: {
          $sum: "$amount",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: Category.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        totalAmount: -1,
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        category: {
          _id: "$_id",
          name: {
            $ifNull: ["$category.name", "Unknown"],
          },
          color: {
            $ifNull: ["$category.color", null],
          },
        },
        totalAmount: 1,
        count: 1,
      },
    },
  ]);
};
