import { Request, Response, NextFunction } from "express";

// Interface for custom API errors
export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  // Check if error is a known API error
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      message: err.message,
      status: "error",
      statusCode: err.statusCode,
    });
    return;
  }

  // Handle multer errors
  if (err.name === "MulterError") {
    res.status(400).json({
      message: err.message,
      status: "error",
      statusCode: 400,
    });
    return;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      message: "Invalid JSON format",
      status: "error",
      statusCode: 400,
    });
    return;
  }

  // Default error response for unexpected errors
  res.status(500).json({
    message: "Internal server error",
    status: "error",
    statusCode: 500,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
