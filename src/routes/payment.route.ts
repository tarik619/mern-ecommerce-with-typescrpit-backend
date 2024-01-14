import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupons,
  newCoupon,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", createPaymentIntent);

router.post("/coupon/new", newCoupon);
router.get("/discount", adminOnly, applyDiscount);
router.get("/coupon/all", adminOnly, allCoupons);
router.delete("/coupon/:id", adminOnly, deleteCoupons);

export default router;
