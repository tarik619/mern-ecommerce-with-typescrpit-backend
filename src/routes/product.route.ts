import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  getLatestProducts,
  newProduct,
  getCategories,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { signleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", adminOnly, signleUpload, newProduct);

router.get("/latest", getLatestProducts);
router.get("/categories", getCategories);
router.get("/admin-products", adminOnly, getAdminProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", adminOnly, signleUpload, updateProduct);
router.delete("/:id", adminOnly, deleteProduct);

export default router;
