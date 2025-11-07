import express from "express";
import authRouter from "./src/routes/auth.route.js";
import messageRouter from "./src/routes/messages.route.js";
import { connectDb } from "./src/db/db.config.js";
import { config } from "./src/config/conf.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./src/libs/socket.js";
import path from "path";

const port = config.port;
const __dirname = path.resolve();

app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    });
}

server.listen(port, () => {
    console.log("server is running on port ", port);
    connectDb();
});
