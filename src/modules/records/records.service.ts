import { z } from "zod";
import prisma from "../../config/db.ts";
import { Prisma } from "../../generated/prisma/edge.js";
import { ApiError } from "../../utils/errors.ts";
import { createRecordSchema, getRecordsQuerySchema, updateRecordSchema } from "./records.schema.ts";

type CreateRecordInput = z.infer<typeof createRecordSchema>;
type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
type GetRecordsQuery = z.infer<typeof getRecordsQuerySchema>;

export const createRecord = async (data: CreateRecordInput, userId: string) => {
    const record = await prisma.record.create({
        data: {
            ...data,
            date: new Date(data.date),
            userId,
            createdBy: userId,
        },
    });

    return record;
};

export const getRecords = async (query: GetRecordsQuery) => {
    const {
        page,
        limit,
        type,
        category,
        startDate,
        endDate,
        includeDeleted
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.RecordWhereInput = {};

    if (!includeDeleted) {
        where.deleted = false;
    }

    if (type) {
        where.type = type;
    }

    if (category) {
        where.category = {
            contains: category,
            mode: "insensitive",
        };
    }

    if (startDate || endDate) {
        where.date = {};

        if (startDate) {
            where.date.gte = new Date(startDate);
        }

        if (endDate) {
            where.date.lte = new Date(endDate);
        }
    }

    const [records, total] = await Promise.all([
        prisma.record.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: "desc" },
        }),
        prisma.record.count({ where }),
    ]);

    return {
        records,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit))
        }
    };
};

export const getRecordById = async (id: string) => {
    const record = await prisma.record.findFirst({
        where: {
            id,
            deleted: false,
        },
    });

    if (!record) {
        throw new ApiError("Record not found", 404);
    }

    return record;
};

export const updateRecord = async (
    id: string,
    data: UpdateRecordInput,
    userId: string
) => {
    const record = await prisma.record.findUnique({
        where: { id },
    });

    if (!record) {
        throw new ApiError("Record not found", 404);
    }

    if (record.deleted) {
        throw new ApiError("Record already deleted", 400);
    }

    const updatedRecord = await prisma.record.update({
        where: { id },
        data: {
            ...data,
            ...(data.date ? { date: new Date(data.date) } : {}),
            updatedBy: userId,
        },
    });

    return updatedRecord;
};

export const deleteRecord = async (id: string, userId: string) => {
    const record = await prisma.record.findUnique({
        where: { id },
    });

    if (!record) {
        throw new ApiError("Record not found", 404);
    }

    if (record.deleted) {
        throw new ApiError("Record already deleted", 400);
    }

    const deletedRecord = await prisma.record.update({
        where: { id },
        data: {
            deleted: true,
            deletedAt: new Date(),
            updatedBy: userId,
        },
    });

    return deletedRecord;
};

export const cleanupRecords = async () => {
    const result = await prisma.record.deleteMany({
        where: {
            deleted: true,
        },
    });

    return result; // Returns count of deleted records
};
