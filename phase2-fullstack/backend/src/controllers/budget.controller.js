import { CATEGORY_TYPE } from "../constants/categoryTypes.js";
import Budget from "../models/budget.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

export const createBudget = async (req, res) => {
  const { category, limitAmount, month } = req.body;

  const isCategory = await Category.findOne({
    _id: category,
    user: req.userId,
    type: CATEGORY_TYPE.EXPENSE,
  });

  if (!isCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const budget = await Budget.findOne({
    user: req.userId,
    category: category,
    month: month,
  });

  if (budget) {
    return res
      .status(409)
      .json({ message: "Budget for this category and month already exists" });
  }

  const user = await User.findById(req.userId).select("createdAt");
  const accountStartMonth = user.createdAt.toISOString().slice(0, 7);

  if (month < accountStartMonth) {
    return res.status(400).json({
      message: "You cannot create a budget before joining the app",
    });
  }

  const newBudget = await Budget.create({
    user: req.userId,
    category,
    limitAmount,
    month,
  });

  await newBudget.populate("category", "name color");

  return res.status(201).json({
    message: "Budget created successfully",
    Budget: {
      _id: newBudget._id,
      category: newBudget.category,
      limitAmount: newBudget.limitAmount,
      month: newBudget.month,
    },
  });
};

export const listBudgets = async (req, res) => {
  const month = req.validatedQuery.month;

  const filter = {
    user: req.userId,
  };
  if (month) {
    filter.month = month;
  }

  const list = await Budget.find(filter)
    .select("category limitAmount month")
    .sort({ month: -1, _id: -1 })
    .populate("category", "name color")
    .lean();

  return res.status(200).json({ message: "Budget list fetched", list });
};

export const updateBudget = async (req, res) => {
  const limitAmount = req.body.limitAmount;

  const budget = await Budget.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId,
    },
    {
      $set: { limitAmount },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("category limitAmount month")
    .populate("category", "name color")
    .lean();

  if (!budget) {
    return res.status(404).json({ message: "Budget not found" });
  }

  return res
    .status(200)
    .json({ message: "Budget updated successfully", budget });
};

export const deleteBudget = async (req, res) => {
  const budget = await Budget.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!budget) {
    return res.status(404).json({ message: "Budget not found" });
  }
  return res.status(200).json({ message: "Budget deleted successfully" });
};
