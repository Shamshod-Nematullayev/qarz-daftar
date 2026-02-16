import express from "express";

const app = express();

app.use(express.json());

// Import routes
import authRoutes from "./modules/auth/auth.routes";
import customerRoutes from "./modules/customer/customer.routes";
import debtRoutes from "./modules/debts/debts.routes";
import statsRoutes from "./modules/stats/stats.routes";

// Use routes
app.use("/api/auth", authRoutes);
app.use(isAuth); // Middleware to protect routes
app.use("/api/customers", customerRoutes);
app.use("/api/debts", debtRoutes);
app.use("/api/stats", statsRoutes);

// 404 error handler
app.use((req, res, next) => {
  const error = new BadRequestError("Endpoint not found", 404);
  next(error);
});

// Global error handler
import {
  BadRequestError,
  globalErrorHandler,
} from "./middlewares/globalErrorHandler";
import { isAuth } from "./middlewares/isAuth";
app.use(globalErrorHandler);

export default app;
