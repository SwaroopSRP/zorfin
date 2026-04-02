import cors from "cors";
import express from "express";

const app = express();
export default app;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.get("/", (_req, res) => {
    res.status(200).send(
        "Welcome! You are now accessing an instance of Zorfin API server. Please refer to the documentation for available endpoints and usage instructions."
    );
});
