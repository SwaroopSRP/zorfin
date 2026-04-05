import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "node:path";
import apiRouter from "./api.routes.ts";
import { mockAuth } from "./middleware/auth.middleware.ts";
import errorHandler from "./middleware/error.middleware.ts";
import requestLogger from "./middleware/logger.middleware.ts";

const app = express();
export default app;

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(errorHandler);
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);
app.use(requestLogger);
app.use(mockAuth);

app.use("/api/v1", apiRouter);

app.get("/", (_req, res) => {
    res.format({
        "text/html": () => {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        },
        "text/plain": () => {
            res.send("Welcome! You are now accessing an instance of Zorfin API server. Please refer to the documentation for available endpoints and usage instructions.");
        },
        "application/json": () => {
            res.json({ message: "Hello from Zorfin API Server!" });
        }
    });
});
