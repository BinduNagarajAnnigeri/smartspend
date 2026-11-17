import Category from "../models/category.model.js";
import Transaction from "../models/transaction.model.js";
import Budget from "../models/budget.model.js";

export const createCategory = async (req, res) => {
  const { name, type, color } = req.body;
  const user = req.userId;

  const category = await Category.findOne({
    name: name.trim().toLowerCase(),
    type,
    user,
  });

  if (category) {
    return res.status(409).json({ message: "category exists" });
  }

  const newCategory = await Category.create({ name, type, user, color });

  return res.status(201).json({
    message: "Category created successfully",
    category: {
      _id: newCategory._id,
      name: newCategory.name,
      type: newCategory.type,
      color: newCategory.color,
    },
  });
};

export const listCategory = async (req, res) => {
  const list = await Category.find({ user: req.userId })
    .select("name type color")
    .sort({ name: 1 });
  return res
    .status(200)
    .json({ message: "Categories fetched successfully", list });
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;

  const category = await Category.findOneAndUpdate(
    { _id: id, user: req.userId },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res
    .status(200)
    .json({ message: "Category updated successfully", category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.userId,
  }).select("_id");

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const [hasTransactions, hasBudgets] = await Promise.all([
    Transaction.exists({
      category: category._id,
      user: req.userId,
    }),

    Budget.exists({ category: category._id, user: req.userId }),
  ]);

  if (hasTransactions || hasBudgets) {
    return res
      .status(409)
      .json({ message: "Category is in use and cannot be deleted" });
  }

  await category.deleteOne();

  return res.status(200).json({ message: "Category deleted successfully" });
};

export const getCategoryByID = async (req, res) => {
  const id = req.params.id;

  const category = await Category.findOne({ _id: id, user: req.userId });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.status(200).json({ message: "category found", category });
};
