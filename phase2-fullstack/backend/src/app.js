import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cookieParser from "cookie-parser";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import summaryRoutes from "./routes/summary.routes.js";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || false, credentials: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "SmartSpend API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/summary", summaryRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
