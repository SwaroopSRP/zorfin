import { Router } from "express";
import validate from "../../middleware/validate.middleware.ts";
import asyncHandler from "../../utils/asyncHandler.ts";
import { loginController, registerController } from "./auth.controller.ts";
import { loginSchema, registerSchema } from "./auth.schema.ts";

const authRouter = Router();

authRouter.post(
    "/register",
    validate(registerSchema),
    asyncHandler(registerController)
);

authRouter.post(
    "/login",
    validate(loginSchema),
    asyncHandler(loginController)
);

export default authRouter;
