import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getUserProfile, loginUser, logout, registerUser, updateUserProfile } from '../controllers/auth.controller.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile").put(isAuthenticated, updateUserProfile);
router.route("/upload-image").post(upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({ imageUrl })
})

export default router;