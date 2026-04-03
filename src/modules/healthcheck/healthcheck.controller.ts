import prisma from "../../config/db.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { success } from "../../utils/responses.ts";

export const healthCheck = asyncHandler(async (_req: any, res: any) => {
    let dbStatus = "Ok";

    try {
        await prisma.$connect();
    } catch (error) {
        dbStatus = "Degraded";
    }

    return success(res, {
        status: dbStatus,
        db: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});