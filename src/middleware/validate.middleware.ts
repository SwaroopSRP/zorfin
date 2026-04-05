import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/errors.ts";

export const validate =
    (schema: ZodSchema, source: "body" | "params" | "query" = "body") =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse(req[source]);

            if (!result.success) {
                const errors = result.error.issues.map((e) => e.message);
                throw new ApiError(errors.join(", "), 400);
            }

            req.validated = {
                ...(req.validated || {}),
                [source]: result.data,
            };

            next();
        };

export default validate;
