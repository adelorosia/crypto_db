import express from "express";
import {
  getAllUsers,
  getLoggedInUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/token/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";

const router = express.Router();

router.get("/api/token", refreshToken);

router.post("/api/register", registerUser);
router.post("/api/login", loginUser);
router.delete("/api/logout", logoutUser);

router.get("/api/user/display", getAllUsers);
router.get("/api/user/displayById", verifyToken, getLoggedInUser);

export default router;
