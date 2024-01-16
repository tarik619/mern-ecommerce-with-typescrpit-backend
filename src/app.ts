import express from "express";
// import mongoose from "mongoose";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import dashboardRoute from "./routes/stats.route.js";
import { config } from "dotenv";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";

config({
  path: "./.env",
});

const stripeKey = process.env.STRIPE_KEY || "";
connectDB(process.env.MONGO_URI || "");

export const stripe = new Stripe(stripeKey);

export const nodeCache = new NodeCache();

// import dotenv from "dotenv";

// dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("mongodb is connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("api working");
});

// using routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
