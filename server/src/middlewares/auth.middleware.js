import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from "../config/conf.config.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res
                .status(401)
                .json(new ApiError(401, "Unauthorised - Token missing"));
        }

        const decoded = jwt.verify(token, config.jwtSecret);

        if (!decoded.userId) {
            return res
                .status(401)
                .json(new ApiError(401, "Unauthorised - Invalid Token"));
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error while authenticating the user: ", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
