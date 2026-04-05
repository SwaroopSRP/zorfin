import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.ts";
import {
    cleanupRecords,
    createRecord,
    deleteRecord,
    getRecordById,
    getRecords,
    updateRecord,
} from "./records.controller.ts";
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
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(createRecordSchema),
    createRecord
);

recordRouter.get(
    "/",
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(getRecordsQuerySchema, "query"),
    getRecords
);

recordRouter.get(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(recordIdParamSchema, "params"),
    getRecordById
);

recordRouter.patch(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(recordIdParamSchema, "params"),
    validate(updateRecordSchema),
    updateRecord
);

recordRouter.delete(
    "/cleanup",
    authenticate,
    authorize(Role.ADMIN),
    cleanupRecords
);

recordRouter.delete(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.ANALYST),
    validate(recordIdParamSchema, "params"),
    deleteRecord
);

export default recordRouter;
