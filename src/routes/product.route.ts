import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { newProduct } from "../controllers/product.controller.js";
import { signleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", adminOnly, signleUpload, newProduct);

export default router;
