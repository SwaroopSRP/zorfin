import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors.ts";

const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
        });
    }

    // In case of Unknown Error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && {
            error: err.message,
        }),
    });
};

export default errorHandler;
