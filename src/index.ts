import dotenv from "dotenv";
import app from "./app.ts";
import prisma from "./config/db.ts";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3001;

console.log("Zorfin API server is initializing...");

try {
    await prisma.$connect();
    console.log("Database connection established.");

    app.listen(port, () => {
        console.log(`Zorfin API server is up and running on port ${port}...\nAccess it at http://localhost:${port}/`);
    });
} catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
}

// Graceful Shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
