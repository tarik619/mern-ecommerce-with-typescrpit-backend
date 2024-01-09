import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  deleteCoupons,
  newCoupon,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/coupon/new", newCoupon);
router.get("/discount", applyDiscount);
router.get("/coupon/all", allCoupons);
router.get("/coupon/:id", deleteCoupons);

export default router;
