import jwt from "jsonwebtoken";
import { config } from "../config/conf.config.js";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: config.nodeEnv !== "development",
    });

    return token;
};
