import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.ts";
import { success } from "../../utils/responses.ts";
import * as recordService from "./records.service.ts";

export const createRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await recordService.createRecord(
        req.validated?.body,
        req.user!.id
    );

    return success(res, record, "Record created", 201);
});

export const getRecords = asyncHandler(async (req: Request, res: Response) => {
    const result = await recordService.getRecords(
        req.validated?.query
    );

    return success(res, result);
});

export const getRecordById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validated?.params;

    const record = await recordService.getRecordById(id);

    return success(res, record);
});

export const updateRecord = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validated?.params;

    const updatedRecord = await recordService.updateRecord(
        id,
        req.validated?.body,
        req.user!.id
    );

    return success(res, updatedRecord, "Record updated");
});

export const deleteRecord = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validated?.params;

    const record = await recordService.deleteRecord(
        id,
        req.user!.id
    );

    return success(res, record, "Record deleted");
});

export const cleanupRecords = asyncHandler(async (_req: Request, res: Response) => {
    const result = await recordService.cleanupRecords();

    return success(
        res,
        result,
        result.count === 0
            ? "No records to clean up"
            : `Cleanup completed. ${result.count} records permanently deleted`
    );
});