import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.ts";
import { success } from "../../utils/responses.ts";
import * as userService from "./user.service.ts";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.validated?.body);

    return success(res, user, "User created", 201);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const {
        page,
        limit,
        includeDeleted,
        search,
        role,
        status,
    } = req.validated?.query ?? {};

    const result = await userService.getUsers(
        page,
        limit,
        includeDeleted,
        search,
        role,
        status
    );

    return success(res, result);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await userService.getUserById(Array.isArray(id) ? id[0] : id);

    return success(res, user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedUser = await userService.updateUser(
        Array.isArray(id) ? id[0] : id,
        req.validated?.body
    );

    return success(res, updatedUser, "User updated");
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await userService.deleteUser(
        Array.isArray(id) ? id[0] : id
    );

    return success(res, user, "User deleted");
});

export const cleanupUsers = asyncHandler(async (_req: Request, res: Response) => {
    const result = await userService.cleanupDeletedUsers();

    return success(
        res,
        result,
        result.count === 0
            ? "No users to clean up"
            : `Cleanup completed. ${result.count} users permanently deleted`
    );
});