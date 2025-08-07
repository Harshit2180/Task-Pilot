import express from 'express';
import { isAuthenticated, adminOnly } from '../middlewares/isAuthenticated.js';
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from '../controllers/task.controller.js';

const router = express.Router();

router.route("/dashboard-data").get(isAuthenticated, getDashboardData);
router.route("/user-dashboard-data").get(isAuthenticated, getUserDashboardData);
router.route("/").get(isAuthenticated, getTasks);
router.route("/:id").get(isAuthenticated, getTaskById);
router.route("/").post(isAuthenticated, adminOnly, createTask);
router.route("/:id").put(isAuthenticated, updateTask);
router.route("/:id").delete(isAuthenticated, adminOnly, deleteTask);
router.route("/:id/status").put(isAuthenticated, updateTaskStatus);
router.route("/:id/todo").put(isAuthenticated, updateTaskChecklist);



export default router;