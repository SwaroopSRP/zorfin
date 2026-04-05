import { Request, Response } from "express";
import { success } from "../../utils/responses.ts";
import { loginUser, registerUser } from "./auth.service.ts";

export const registerController = async (req: Request, res: Response) => {
    const { email, password, name } = req.validated!.body;

    const user = await registerUser(email, password, name);

    return success(res, user, "User registered successfully", 201);
};

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.validated!.body;

    const data = await loginUser(email, password);

    return success(res, data, "Login successful");
};