export const notFound = (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  // If a response has already started, let Express close the connection
  if (res.headersSent) return next(err);

  if (err.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "A record with these values already exists",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: `Invalid value for ${err.path}`,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "error",
      message: "Invalid JSON in request body",
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { detail: err.message }),
  });
};
