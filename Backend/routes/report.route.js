import express from 'express'
import { adminOnly, isAuthenticated } from '../middlewares/isAuthenticated.js';
import { exportTasksReport, exportUsersReport } from '../controllers/report.controller.js';


const router = express.Router();

router.route("/export/tasks").get(isAuthenticated, adminOnly, exportTasksReport);
router.route("/export/users").get(isAuthenticated, adminOnly, exportUsersReport);


export default router;