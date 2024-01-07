import express from "express";
// import mongoose from "mongoose";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";

connectDB();
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

const port = 3000;

app.get("/", (req, res) => {
  res.send("api working");
});

// using routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
