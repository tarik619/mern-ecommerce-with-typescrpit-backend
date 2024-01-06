import { User } from "../models/user.model.js";
import errorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new errorHandler("please log in first", 401));
  const user = await User.findById(id);
  if (!user) return next(new errorHandler("invalid credentials", 401));
  if (user.role !== "admin")
    return next(new errorHandler("you are not allowed", 401));
  next();
});
