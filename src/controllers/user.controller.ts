import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/user.type.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    const user = await User.create({
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
