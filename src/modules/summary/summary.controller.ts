import { Request, Response } from "express";
import { success } from "../../utils/responses.ts";
import { getCategoryBreakdown, getOverview, getRecentActivity, getTrends } from "./summary.service.ts";

export const getOverviewController = async (_req: Request, res: Response) => {
    const data = await getOverview();

    return success(res, data, "Overview fetched successfully");
};

export const getCategoryBreakdownController = async (
    _req: Request,
    res: Response
) => {
    const data = await getCategoryBreakdown();

    return success(res, data, "Category breakdown fetched successfully");
};

export const getRecentActivityController = async (
    req: Request,
    res: Response
) => {
    const { limit } = req.validated?.query as { limit?: number } || {};

    const data = await getRecentActivity({ limit });

    return success(res, data, "Recent activity fetched successfully");
};

export const getTrendsController = async (
    req: Request,
    res: Response
) => {
    const { days } = req.validated?.query as { days?: number } || {};

    const data = await getTrends({ days });

    return success(res, data, "Weekly trends fetched successfully");
};
