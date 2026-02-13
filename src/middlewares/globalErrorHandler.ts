import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "BadRequestError";
  }
}

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
): any => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request data",
      issues: err.issues,
    });
  }

  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error("🔥 Unhandled Error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
};
