import mongoose from "mongoose";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.model.js";
export const connectDB = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "Ecommerce_2024",
    })
        .then((c) => {
        console.log(`db connected to ${c.connection.host}`);
    });
};
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
            `product-${productId}}`,
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        // `product-${id}`
        nodeCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
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
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product not found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
