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
  getAllProducts,
} from "../controllers/product.controller.js";
import { signleUpload } from "../middlewares/multer.js";

const router = express.Router();
// to create product
router.post("/new", adminOnly, signleUpload, newProduct);
// to get latest products
router.get("/latest", getLatestProducts);
// to get all products with filters
router.get("/all", getAllProducts);
router.get("/categories", getCategories);
router.get("/admin-products", adminOnly, getAdminProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", adminOnly, signleUpload, updateProduct);
router.delete("/:id", adminOnly, deleteProduct);

export default router;
