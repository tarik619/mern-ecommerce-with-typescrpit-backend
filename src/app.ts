import express from "express";
import userRoute from "./routes/user.route.js";

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("api working");
});

// using routes
app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
