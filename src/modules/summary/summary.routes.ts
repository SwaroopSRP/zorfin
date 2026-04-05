import { Router } from "express";
import { authorize } from "../../middleware/auth.middleware.ts";
import validate from "../../middleware/validate.middleware.ts";
import asyncHandler from "../../utils/asyncHandler.ts";
import { getCategoryBreakdownController, getOverviewController, getRecentActivityController, getTrendsController } from "./summary.controller.ts";
import { recentActivityQuerySchema, trendsQuerySchema } from "./summary.schema.ts";

const router = Router();

router.get(
    "/overview",
    authorize("ADMIN", "ANALYST", "VIEWER"),
    asyncHandler(getOverviewController)
);

router.get(
    "/category",
    authorize("ADMIN", "ANALYST", "VIEWER"),
    asyncHandler(getCategoryBreakdownController)
);

router.get(
    "/recent",
    authorize("ADMIN", "ANALYST"),
    validate(recentActivityQuerySchema, "query"),
    asyncHandler(getRecentActivityController)
);

router.get(
    "/trends",
    authorize("ADMIN", "ANALYST", "VIEWER"),
    validate(trendsQuerySchema, "query"),
    asyncHandler(getTrendsController)
);

export default router;
