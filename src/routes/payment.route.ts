import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { applyDiscount, newCoupon } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/coupon/new", newCoupon);
router.get("/discount", applyDiscount);

export default router;
