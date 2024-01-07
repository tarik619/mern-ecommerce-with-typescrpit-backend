import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/user.type.js";
import { Product } from "../models/product.model.js";
import errorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    if (!photo) {
      return next(new errorHandler("please add photo", 400));
    }

    if (!name || !price || !category || !stock) {
      rm(photo.path, () => {
        console.log("deleted");
      });

      return next(new errorHandler("please enter all fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const getLatestProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(201).json({
      success: true,
      products,
    });
  }
);

export const getCategories = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(201).json({
      success: true,
      categories,
    });
  }
);

export const getAdminProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const products = await Product.find({});
    return res.status(201).json({
      success: true,
      products,
    });
  }
);

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.findById(id);
  return res.status(201).json({
    success: true,
    products,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);
  if (!product) return next(new errorHandler("invalid product id", 400));

  if (photo) {
    rm(product.photo!, () => {
      console.log("old photo deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (category) product.category = category;
  if (stock) product.stock = stock;

  await product.save();

  return res.status(201).json({
    success: true,
    message: "Product updated successfully",
  });
});
