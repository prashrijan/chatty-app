import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
    getMessages,
    getUsersForSidebar,
    sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/users").get(authenticateUser, getUsersForSidebar);
router.route("/:id").get(authenticateUser, getMessages);

router.route("/send/:id").post(authenticateUser, sendMessage);

export default router;
