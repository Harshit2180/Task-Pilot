import { Task } from '../models/task.model.js'
import { User } from '../models/user.model.js'
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {

        const users = await User.find({ role: 'member' }).select("-password");

        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending"
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress"
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed"
                });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                }
            }))

        return res.status(200).json({
            success: true,
            users: usersWithTaskCounts
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get users"
        })
    }
}

export const getUsersById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User not found"
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
            message: "Failed to get user"
        })

    }
}

