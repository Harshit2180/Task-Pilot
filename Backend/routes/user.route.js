import express from 'express';
import { isAuthenticated, adminOnly } from '../middlewares/isAuthenticated.js';
import { getUsers, getUsersById } from '../controllers/user.controller.js';


const router = express.Router();

router.route("/").get(isAuthenticated, adminOnly, getUsers);
router.route("/:id").get(isAuthenticated, getUsersById);

export default router;