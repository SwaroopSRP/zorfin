import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors.ts";

export const mockAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const roleHeader = req.headers["role"] as string | undefined;

    const role = (roleHeader?.toUpperCase() as Role) || "VIEWER";

    req.user = {
        id: "mock-user-id", // To be replaced with JWTAuth
        role,
    };

    next();
};

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
