import mongoose from "mongoose";

export const validate = (schema) => {
  return function (req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.format(); // or z.treeifyError(result.error);
      return res.status(422).json({
        status: "error",
        message: "Validation Failed",
        errors: errors,
      });
    }
    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema) => {
  return function (req, res, next) {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation Failed",
        errors: result.error.format(),
      });
    }

    req.validatedQuery = result.data;
    next();
  };
};

export function validateObjectId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({
      message: "Invalid id",
    });
  }
  next();
}
