import { Role } from "@prisma/client";
import { Router } from "express";
import validate from "../../middleware/validate.middleware.ts";
import { authenticate, authorize } from "../auth/auth.middleware.ts";
import { cleanupUsers, createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller.ts";
import { createUserSchema, getUsersQuerySchema, updateUserSchema, userIdParamSchema } from "./user.schema.ts";

const userRouter = Router();

userRouter.post(
    "/",
    authenticate,
    authorize(Role.ADMIN),
    validate(createUserSchema),
    createUser
);

userRouter.get(
    "/",
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(getUsersQuerySchema, "query"),
    getUsers
);

userRouter.get(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(userIdParamSchema, "params"),
    getUserById
);

userRouter.patch(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validate(updateUserSchema),
    updateUser
);

userRouter.delete(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validate(userIdParamSchema, "params"),
    deleteUser
);

userRouter.delete(
    "/cleanup",
    authenticate,
    authorize(Role.ADMIN),
    cleanupUsers
);

export default userRouter;
