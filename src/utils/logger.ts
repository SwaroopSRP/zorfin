import fs from "node:fs";
import path from "node:path";

const isProd = process.env.NODE_ENV === "production";

const logDir = "logs";

// Log files created only in non-production environments
if (!isProd && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const getLogFile = () => {
    const date = new Date().toISOString().split("T")[0];
    return path.join(logDir, `app-${date}.log`);
};

const format = (level: string, message: string) => {
    return `[${new Date().toISOString()}] [${level}] ${message}`;
};

const writeToFile = (message: string) => {
    if (isProd) return;

    fs.appendFileSync(getLogFile(), message + "\n");
};

export const log = (message: string) => {
    const formatted = format("INFO", message);

    console.log(formatted); // log to console
    writeToFile(formatted); // log to file in non-production
};

export const errorLog = (message: string, meta?: any) => {
    const formatted = format("ERROR", message);

    console.error(formatted, meta || "");
    writeToFile(formatted + (meta ? ` ${JSON.stringify(meta)}` : ""));
};
