import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }
        else {
            res.status(401).json({
                message: "Not authorized, no token"
            })
        }

    } catch (error) {
        res.status(401).json({
            message: "Token failed",
            error: error.message
        })
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({
            message: "Access denied, admin only"
        })
    }
}

