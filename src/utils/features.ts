import mongoose from "mongoose";
import { InvalidateCacheProps, OrerItemType } from "../types/user.type.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
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
  userId,
  orderId,
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
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    // const orders = await Order.find({}).select("_id");
    // orders.forEach((i) => {
    //   orderKeys.push();
    // });
    nodeCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrerItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= order.quantity;
    await product.save();
  }
};
