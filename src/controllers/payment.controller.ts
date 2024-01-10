import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.model.js";
import errorHandler from "../utils/utility-class.js";

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new errorHandler("please enter both coupon and amount", 400));

  await Coupon.create({ code: coupon, amount });
  return res
    .status(201)
    .json({ success: true, message: `Coupon ${coupon}created successfully` });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) return next(new errorHandler("coupon not found", 404));
  return res.status(201).json({ success: true, discount: discount.amount });
});

export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  return res.status(201).json({ success: true, coupons });
});

export const deleteCoupons = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) return next(new errorHandler("invalid coupon id", 400));

  return res
    .status(201)
    .json({ success: true, message: `coupon  deleted successfully` });
});
