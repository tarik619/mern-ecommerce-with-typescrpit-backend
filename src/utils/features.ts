import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "Ecommerce_2024",
    })
    .then((c) => {
      console.log(`db connected to ${c.connection.host}`);
    });
};
