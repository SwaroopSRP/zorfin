import bcrypt from "bcrypt";
import prisma from "../../config/db.ts";
import { ApiError } from "../../utils/errors.ts";
import { signToken } from "../../utils/jwt.utils.ts";

export const registerUser = async (
    email: string,
    password: string,
    name: string
) => {
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        throw new ApiError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: "VIEWER", // Default
        },
    });

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true,
            role: true,
        },
    });

    if (!user) {
        throw new ApiError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError("Invalid credentials", 401);
    }

    const token = signToken({
        id: user.id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
};
