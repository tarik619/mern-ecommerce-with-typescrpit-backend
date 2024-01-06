import express from "express";
import { newUser, getAllusers } from "../controllers/user.controller.js";

const router = express.Router();

// route - /api/user/new
router.post("/new", newUser);

// route - /api/user/all
router.get("/all", getAllusers);

export default router;
