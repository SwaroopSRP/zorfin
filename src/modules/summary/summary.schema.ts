import { z } from "zod";

export const recentActivityQuerySchema = z.object({
    limit: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return undefined;
            const parsed = Number(val);
            return Number.isNaN(parsed) ? undefined : parsed;
        })
        .refine(
            (val) =>
                val === undefined ||
                (Number.isInteger(val) && val > 0 && val <= 50),
            {
                message: "limit must be an integer between 1 and 50",
            }
        ),
});

export const trendsQuerySchema = z.object({
    days: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return undefined;
            const parsed = Number(val);
            return Number.isNaN(parsed) ? undefined : parsed;
        })
        .refine(
            (val) =>
                val === undefined ||
                (Number.isInteger(val) && val > 0 && val <= 365),
            {
                message: "days must be an integer between 1 and 365",
            }
        ),
});