import express from "express";
import {
  newUser,
  getAllusers,
  deleteUser,
  getUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// route - /api/user/new
router.post("/new", newUser);

// route - /api/user/all
router.get("/all", getAllusers);

// route - /api/user/dynamicId
router.get("/:id", getUser);

// route - /api/user/dynamicId
router.delete("/:id", deleteUser);

export default router;
