import { Role } from "@prisma/client";
import { Router } from "express";

import {
    cleanupRecords,
    createRecord,
    deleteRecord,
    getRecordById,
    getRecords,
    updateRecord,
} from "./records.controller.ts";

import { authorize } from "../../middleware/auth.middleware.ts";
import validate from "../../middleware/validate.middleware.ts";

import {
    createRecordSchema,
    getRecordsQuerySchema,
    recordIdParamSchema,
    updateRecordSchema,
} from "./records.schema.ts";

const recordRouter = Router();

recordRouter.post(
    "/",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(createRecordSchema),
    createRecord
);

recordRouter.get(
    "/",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(getRecordsQuerySchema, "query"),
    getRecords
);

recordRouter.get(
    "/:id",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(recordIdParamSchema, "params"),
    getRecordById
);

recordRouter.patch(
    "/:id",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(recordIdParamSchema, "params"),
    validate(updateRecordSchema),
    updateRecord
);

recordRouter.delete(
    "/cleanup",
    authorize(Role.ADMIN),
    cleanupRecords
);

recordRouter.delete(
    "/:id",
    authorize(Role.ADMIN, Role.ANALYST),
    validate(recordIdParamSchema, "params"),
    deleteRecord
);

export default recordRouter;
