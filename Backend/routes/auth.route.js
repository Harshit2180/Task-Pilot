import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getUserProfile, loginUser, logout, registerUser, updateUserProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile").put(isAuthenticated, updateUserProfile);

export default router;