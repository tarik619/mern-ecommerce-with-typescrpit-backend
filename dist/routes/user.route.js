import express from "express";
import { newUser, getAllusers, getUser, } from "../controllers/user.controller.js";
const router = express.Router();
// route - /api/user/new
router.post("/new", newUser);
// route - /api/user/all
router.get("/all", getAllusers);
// route - /api/user/dynamicId
router.get("/:id", getUser);
export default router;
