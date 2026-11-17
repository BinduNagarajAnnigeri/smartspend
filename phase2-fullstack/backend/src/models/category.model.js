import mongoose from "mongoose";
import { CATEGORY_TYPE_VALUES } from "../constants/categoryTypes.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: {
        values: CATEGORY_TYPE_VALUES,
      },
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#808080",
    },
  },
  { timestamps: true },
);

categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
