import { Router } from "express";
import validate from "../../middleware/validate.middleware.ts";
import asyncHandler from "../../utils/asyncHandler.ts";
import { authenticate, authorize } from "../auth/auth.middleware.ts";
import { getCategoryBreakdownController, getOverviewController, getRecentActivityController, getTrendsController } from "./summary.controller.ts";
import { recentActivityQuerySchema, trendsQuerySchema } from "./summary.schema.ts";

const router = Router();

router.get(
    "/overview",
    authenticate,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    asyncHandler(getOverviewController)
);

router.get(
    "/category",
    authenticate,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    asyncHandler(getCategoryBreakdownController)
);

router.get(
    "/recent",
    authenticate,
    authorize("ADMIN", "ANALYST"),
    validate(recentActivityQuerySchema, "query"),
    asyncHandler(getRecentActivityController)
);

router.get(
    "/trends",
    authenticate,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    validate(trendsQuerySchema, "query"),
    asyncHandler(getTrendsController)
);

export default router;
