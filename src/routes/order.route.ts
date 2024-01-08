import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { newOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/new", newOrder);

export default router;
