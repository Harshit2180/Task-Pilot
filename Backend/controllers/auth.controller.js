import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with this role",
                success: false
            })
        }

        generateToken(res, user, `Welcome back ${user.name}!`)


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to log out"
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name, email, password } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const updatedData = {};

        if (name) updatedData.name = name;
        if (email) updatedData.email = email;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true, runValidators: true }).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        })
    }
}


