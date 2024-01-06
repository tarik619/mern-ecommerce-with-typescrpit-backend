import express from "express";
import { newUser, getAllusers, deleteUser, getUser, } from "../controllers/user.controller.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
// route - /api/user/new
router.post("/new", newUser);
// route - /api/user/all
router.get("/all", adminOnly, getAllusers);
// route - /api/user/dynamicId
router.get("/:id", getUser);
// route - /api/user/dynamicId
router.delete("/:id", adminOnly, deleteUser);
export default router;
