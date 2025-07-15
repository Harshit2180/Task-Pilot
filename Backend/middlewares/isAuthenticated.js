import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }

        req.user = user;
        req.id = user._id;

        next();

    } catch (error) {
        console.log(error)
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role == "admin") {
        next();
    }
    else {
        res.status(403).json({
            message: "Access denied, admin only"
        })
    }
}

