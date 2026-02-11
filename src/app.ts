import express from "express";

const app = express();

app.use(express.json());

// Import routes
import authRoutes from "./modules/auth/auth.routes";

// Use routes
app.use("/api/auth", authRoutes);

// Global error handler
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
app.use(globalErrorHandler);

export default app;
