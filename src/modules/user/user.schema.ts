import { Role, Status } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(Role).optional()
});

export const getUsersQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? Number(v) : 1))
        .refine((v) => v > 0, "Page must be > 0"),

    limit: z
        .string()
        .optional()
        .transform((v) => (v ? Number(v) : 10))
        .refine((v) => v > 0 && v <= 50, "Limit must be 1-50"),

    includeDeleted: z
        .string()
        .optional()
        .transform((v) => v === "true"),

    search: z.string().optional(),

    role: z.nativeEnum(Role).optional(),
    status: z.nativeEnum(Status).optional(),
});

export const userIdParamSchema = z.object({
    id: z.string().uuid("Invalid user ID")
});

export const updateUserSchema = z
    .object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
        role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided"
    });

