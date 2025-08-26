import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getUserProfile, loginUser, logout, registerUser, updateUserProfile } from '../controllers/auth.controller.js';
import upload from '../middlewares/upload.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from "streamifier";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile").put(isAuthenticated, updateUserProfile);
router.route("/upload-image").post(upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    try {
        const result = await new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                { folder: "profile_photos" },
                (error, result) => {
                    if (result) {
                        resolve(result)
                    }
                    else {
                        reject(error)

                    };
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        res.status(200).json({ profileImageUrl: result.secure_url });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Cloudinary upload failed", error: err.message });
    }
})

export default router;