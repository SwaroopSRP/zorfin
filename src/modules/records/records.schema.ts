import { RecordType } from "@prisma/client";
import { z } from "zod";

export const createRecordSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.nativeEnum(RecordType),
    category: z.string().min(1, "Category is required"),
    date: z.string().datetime("Invalid date format"),
    notes: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    });

export const recordIdParamSchema = z.object({
    id: z.string().uuid("Invalid record ID"),
});

export const getRecordsQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? Number(v) : 1))
        .refine((v) => v > 0),

    limit: z
        .string()
        .optional()
        .transform((v) => (v ? Number(v) : 10))
        .refine((v) => v > 0 && v <= 50),

    type: z.nativeEnum(RecordType).optional(),
    category: z.string().optional(),

    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),

    includeDeleted: z
        .string()
        .optional()
        .transform((v) => v === "true"),
});
