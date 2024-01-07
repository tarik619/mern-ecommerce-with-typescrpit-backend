import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  getLatestProducts,
  newProduct,
  getCategories,
} from "../controllers/product.controller.js";
import { signleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", adminOnly, signleUpload, newProduct);

router.get("/latest", getLatestProducts);
router.get("/categories", getCategories);

export default router;
