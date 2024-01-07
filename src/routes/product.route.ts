import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  getLatestProducts,
  newProduct,
  getCategories,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { signleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", adminOnly, signleUpload, newProduct);

router.get("/latest", getLatestProducts);
router.get("/categories", getCategories);
router.get("/admin-products", getAdminProducts);
router.get("/:id", getSingleProduct);
router.get("/:id", signleUpload, updateProduct);

export default router;
