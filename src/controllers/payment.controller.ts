import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.model.js";
import errorHandler from "../utils/utility-class.js";

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new errorHandler("please enter both coupon and amount", 400));

  await Coupon.create({ code: coupon, amount });
  res
    .status(201)
    .json({ success: true, message: `Coupon ${coupon}created successfully` });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) return next(new errorHandler("coupon not found", 404));
  res.status(201).json({ success: true, discount: discount.amount });
});
