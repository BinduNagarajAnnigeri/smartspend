import Transaction from "../models/transaction.model.js";
import Category from "../models/category.model.js";

export const createTransaction = async (req, res) => {
  const category = await Category.findOne({
    _id: req.body.category,
    user: req.userId,
    type: req.body.type,
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const transaction = await Transaction.create({
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    date: req.body.date,
    note: req.body.note,
    user: req.userId,
  });

  return res
    .status(201)
    .json({ message: "Transaction created successfully", transaction });
};

export const listTransactions = async (req, res) => {
  const { type, category, from, to, page, limit } = req.validatedQuery;

  const filter = {
    user: req.userId,
  };
  if (type) {
    filter.type = type;
  }
  if (category) {
    filter.category = category;
  }

  if (from || to) {
    filter.date = {};
    if (from) {
      filter.date.$gte = from;
    }
    if (to) {
      const nextDay = new Date(to);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      filter.date.$lt = nextDay;
    }
  }

  const [list, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ date: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("amount type category date note createdAt")
      .populate("category", "name type color")
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    message: "Transactions fetched successfully",
    list,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
};

export const getTransactionById = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.userId,
  })
    .select("amount type category date note createdAt")
    .populate("category", "name type color")
    .lean();

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res.status(200).json({ message: "Transaction found", transaction });
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res.status(200).json({ message: "Transaction deleted successfully" });
};

export const updateTransaction = async (req, res) => {
  const existing = await Transaction.findOne({
    _id: req.params.id,
    user: req.userId,
  }).select("type");

  if (!existing) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (req.body.category) {
    const category = await Category.findOne({
      _id: req.body.category,
      user: req.userId,
      type: existing.type,
    }).select("_id");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
  }

  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId,
    },
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("amount type category date note createdAt")
    .populate("category", "name type color")
    .lean();

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res
    .status(200)
    .json({ message: "Transaction updated successfully", transaction });
};
