import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/user.type.js";
import { Order } from "../models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
import { nodeCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;
    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subtotal ||
      !tax ||
      //   !shippingCharges ||
      // !discount
      !total
    )
      return next(new errorHandler("please enter all feilds", 400));
    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });
    await reduceStock(orderItems);
    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
    });
    return res.status(201).json({
      success: true,
      message: "order placed successfully",
    });
  }
);

export const myOrder = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-orders-${user}`;
  let orders = [];
  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find({ user });
    nodeCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = "all-orders";
  let orders = [];
  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find().populate("user", "name");
    nodeCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;
  let order;
  if (nodeCache.has(key)) order = JSON.parse(nodeCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new errorHandler("order not found", 404));
    nodeCache.set(key, JSON.stringify(order));
  }
  return res.status(200).json({
    success: true,
    order,
  });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return next(new errorHandler("order not found", 404));

  switch (order.status) {
    case (order.status = "Processing"):
      order.status = "Shipped";
      break;
    case (order.status = "Shipped"):
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }
  await order.save();

  await invalidateCache({
    product: false,
    userId: order.user,
    order: true,
    admin: true,
    orderId: String(order._id),
  });
  return res.status(200).json({
    success: true,
    message: "order processed successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return next(new errorHandler("order not found", 404));

  await order.deleteOne();

  await invalidateCache({
    product: false,
    userId: order.user,
    order: true,
    admin: true,
    orderId: String(order._id),
  });
  return res.status(200).json({
    success: true,
    message: "order deleted successfully",
  });
});
