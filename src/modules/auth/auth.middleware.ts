import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/errors.ts";
import { verifyToken } from "../../utils/jwt.utils.ts";


export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError("Unauthorized", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError("Forbidden", 403);
        }

        next();
    };
};

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);

        req.user = {
            id: decoded.id,
            role: decoded.role as any,
        };

        next();
    } catch {
        throw new ApiError("Invalid or expired token", 401);
    }
};
