import { Role, Status } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "../../config/db.ts";
import { ApiError } from "../../utils/errors.ts";
import { createUserSchema, updateUserSchema } from "./user.schema.ts";


type CreateUserInput = z.infer<typeof createUserSchema>;

type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createUser = async (data: CreateUserInput) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const role = data.role ?? Role.VIEWER;

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role,
        },
    });

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
};

import { Prisma } from "@prisma/client";

export const getUsers = async (
    page = 1,
    limit = 10,
    includeDeleted = false,
    search?: string,
    role?: string,
    status?: string
) => {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    // Soft delete filter
    if (!includeDeleted) {
        where.deleted = false;
    }

    // Search filter
    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                email: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }

    // Role filter
    if (role) {
        where.role = role as Role;
    }

    // Status filter
    if (status) {
        where.status = status as Status;
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                deleted: true,
            },
        }),
        prisma.user.count({
            where,
        }),
    ]);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id,
            deleted: false,
        },
    });

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    return user;
};


export const updateUser = async (
    id: string,
    data: UpdateUserInput
) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (user.deleted) {
        throw new ApiError("User already deleted", 400);
    }

    // Prevent last admin demotion
    if (user.role === "ADMIN" && data.role && data.role !== "ADMIN") {
        const adminCount = await prisma.user.count({
            where: {
                role: "ADMIN",
                deleted: false,
            }
        });

        if (adminCount === 1) {
            throw new ApiError("Cannot demote last admin", 400);
        }
    }

    if (data.email) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing && existing.id !== id) {
            throw new ApiError("Email already exists", 409);
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
    });

    return updatedUser;
};


export const deleteUser = async (
    id: string
) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (user.deleted) {
        throw new ApiError("User already deleted", 400);
    }

    if (user.role === "ADMIN") {
        const adminCount = await prisma.user.count({
            where: {
                role: "ADMIN",
                deleted: false,
            },
        });

        if (adminCount === 1) {
            throw new ApiError("Cannot delete last admin", 400);
        }
    }

    // Soft delete
    const deletedUser = await prisma.user.update({
        where: { id },
        data: {
            deleted: true,
            deletedAt: new Date(),
            status: "INACTIVE",
        },
    });

    return deletedUser;
};

export const cleanupDeletedUsers = async () => {
    const result = await prisma.user.deleteMany({
        where: {
            deleted: true,
        },
    });

    return result; // Returns count of deleted users
};