import { Role } from "@prisma/client";
import { Router } from "express";
import { authorize } from "../../middleware/auth.middleware.ts";
import validate from "../../middleware/validate.middleware.ts";
import { cleanupUsers, createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller.ts";
import { createUserSchema, getUsersQuerySchema, updateUserSchema, userIdParamSchema } from "./user.schema.ts";

const userRouter = Router();

userRouter.post(
    "/",
    authorize(Role.ADMIN),
    validate(createUserSchema),
    createUser
);

userRouter.get(
    "/",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(getUsersQuerySchema, "query"),
    getUsers
);

userRouter.get(
    "/:id",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(userIdParamSchema, "params"),
    getUserById
);

userRouter.patch(
    "/:id",
    authorize(Role.ADMIN),
    validate(updateUserSchema),
    updateUser
);

userRouter.delete(
    "/:id",
    authorize(Role.ADMIN),
    validate(userIdParamSchema, "params"),
    deleteUser
);

userRouter.delete(
    "/cleanup",
    authorize(Role.ADMIN),
    cleanupUsers
);

export default userRouter;
