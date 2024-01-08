import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/user.type.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.model.js";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "Ecommerce_2024",
    })
    .then((c) => {
      console.log(`db connected to ${c.connection.host}`);
    });
};

export const invalidateCache = async ({
  product,
  order,
  admin,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];
    // `product-${id}`
    const products = await Product.find({}).select("_id");
    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });
    nodeCache.del(productKeys);
  }
  if (order) {
  }
  if (admin) {
  }
};
