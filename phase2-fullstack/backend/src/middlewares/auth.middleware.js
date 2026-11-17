import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Access token expired", code: "Token_Expired" });
    }
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const user = await User.findById(decoded.userId).select("_id");

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.userId = decoded.userId;
  next();
};
