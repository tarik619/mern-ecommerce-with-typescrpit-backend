import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/user.type.js";
import { TryCatch } from "../middlewares/error.js";
import errorHandler from "../utils/utility-class.js";
export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `welcome ${user.name}`,
      });
    }
    if (!_id || !name || !email || !photo || !gender || !dob)
      return next(new errorHandler("Please add all fields", 400));
    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob,
    });

    return res.status(201).json({
      success: true,
      message: `welcome ${user.name}`,
    });
  }
);

export const getAllusers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new errorHandler("invalid id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});
