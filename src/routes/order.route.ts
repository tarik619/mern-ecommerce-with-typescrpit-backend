import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  newOrder,
  allOrders,
  myOrder,
  getSingleOrder,
  processOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/new", newOrder);

router.get("/my", myOrder);
router.get("/all", adminOnly, allOrders);
router.get("/:id", getSingleOrder);
router.put("/:id", adminOnly, processOrder);
router.delete("/:id", adminOnly, deleteOrder);

export default router;
