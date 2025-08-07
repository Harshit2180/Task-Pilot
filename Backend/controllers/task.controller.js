import { Task } from '../models/task.model.js'


export const getTasks = async (req, res) => {
    try {

        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }
        else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl")
        }

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter((item) => item.completed).length;
                return { ...task._doc, completedTodoCount: completedCount }
            })
        )

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        )

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })

        return res.status(201).json({
            success: true,
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get tasks"
        })
    }
}

export const getTaskById = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            })
        }

        return res.status(201).json({
            success: true,
            task
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get task"
        })
    }
}

export const createTask = async (req, res) => {
    try {

        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({
                success: false,
                message: "assignedTo must be an array of user IDs"
            })
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments
        })

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create task"
        })
    }
}

export const updateTask = async (req, res) => {
    try {

        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            })
        }

        const updatedData = {};

        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (priority) updatedData.priority = priority;
        if (dueDate) updatedData.dueDate = dueDate;
        if (todoChecklist) updatedData.todoChecklist = todoChecklist;
        if (attachments) updatedData.attachments = attachments;

        if (assignedTo) {
            if (!Array.isArray(assignedTo)) {
                return res.status(400).json({
                    success: false,
                    message: "assignedTo must be an array of user IDs"
                })
            }
            updatedData.assignedTo = assignedTo
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatedData, { new: true })

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            updatedTask
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update task"
        })
    }
}

export const deleteTask = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            })
        }

        await task.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to delete task"
        })
    }
}

export const updateTaskStatus = async (req, res) => {
    try {

        const { status } = req.body
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            })
        }

        const isAssigned = task.assignedTo.some(
            (userid) => userid.toString() === req.user._id.toString()
        )

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            })
        }

        const updatedData = {};

        if (status) task.status = status;

        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => (item.completed = true))
            task.progress = 100;
        }

        const updatedTaskStatus = await Task.findByIdAndUpdate(req.params.id, updatedData, { new: true })

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            updatedTaskStatus
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update task status"
        })
    }
}

export const updateTaskChecklist = async (req, res) => {
    try {

        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            })
        }

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update checklist"
            })
        }

        task.todoChecklist = todoChecklist;

        const completedCount = task.todoChecklist.filter((item) => item.completed).length
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

        if (task.progress === 100) {
            task.status = "Completed"
        }
        else if (task.progress > 0) {
            task.status = "In Progress"
        }
        else {
            task.status = "Pending"
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )

        return res.status(200).json({
            success: true,
            message: "Task checklist updated",
            task: updatedTask
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update task checklist"
        })
    }
}

export const getDashboardData = async (req, res) => {
    try {

        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"]
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0
            return acc;
        }, {})

        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"]
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ])

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc
        }, {})

        const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt")

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get dashboard data"
        })
    }
}

export const getUserDashboardData = async (req, res) => {
    try {

        const userId = req.user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"]
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ])

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0
            return acc
        }, {})

        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"]
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ])

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc
        }, {})

        const recentTasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt")

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get user dashboard data"
        })
    }
}