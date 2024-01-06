import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/user.type.js";

export const errorMiddleware = (
  err: errorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    success: false,
    message: "some error",
  });
};

export const TryCatch = (func: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
};
