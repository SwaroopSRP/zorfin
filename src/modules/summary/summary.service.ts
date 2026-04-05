import prisma from "../../config/db.ts";
import { ApiError } from "../../utils/errors.ts";
import getISOWeek from "../../utils/date.utils.ts";

type OverviewResponse = {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
};

type CategoryBreakdownItem = {
    category: string;
    total: number;
};

type RecentActivityParams = {
    limit?: number;
};

type TrendsParams = {
    days?: number;
};

type WeeklyTrend = {
    week: string;
    income: number;
    expense: number;
};

export const getOverview = async (): Promise<OverviewResponse> => {
    try {
        const [incomeAgg, expenseAgg] = await Promise.all([
            prisma.record.aggregate({
                where: { type: "INCOME", deleted: false },
                _sum: { amount: true },
            }),
            prisma.record.aggregate({
                where: { type: "EXPENSE", deleted: false },
                _sum: { amount: true },
            }),
        ]);

        const totalIncome = incomeAgg._sum.amount ?? 0;
        const totalExpense = expenseAgg._sum.amount ?? 0;

        return {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
        };
    } catch (error) {
        throw new ApiError("Failed to fetch overview summary", 500);
    }
};

export const getCategoryBreakdown = async (): Promise<CategoryBreakdownItem[]> => {
    try {
        const result = await prisma.record.groupBy({
            by: ["category"],
            where: {
                deleted: false,
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
        });

        return result.map((item) => ({
            category: item.category,
            total: item._sum.amount ?? 0,
        }));
    } catch (error) {
        throw new ApiError("Failed to fetch category breakdown", 500);
    }
};

export const getRecentActivity = async (
    params: RecentActivityParams
) => {
    try {
        const limit = Math.min(params.limit ?? 5, 50);

        const records = await prisma.record.findMany({
            where: {
                deleted: false,
            },
            orderBy: {
                date: "desc",
            },
            take: limit,
            select: {
                id: true,
                amount: true,
                type: true,
                category: true,
                date: true,
                notes: true,
                createdAt: true,
            },
        });

        return records;
    } catch (error) {
        throw new ApiError("Failed to fetch recent activity", 500);
    }
};

export const getTrends = async (
    params: TrendsParams
): Promise<WeeklyTrend[]> => {
    try {
        const days = Math.min(params.days ?? 30, 365);

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const records = await prisma.record.findMany({
            where: {
                deleted: false,
                date: {
                    gte: fromDate,
                },
            },
            select: {
                amount: true,
                type: true,
                date: true,
            },
        });

        const trendsMap: Record<string, WeeklyTrend> = {};

        for (const record of records) {
            const weekKey = getISOWeek(record.date);

            if (!trendsMap[weekKey]) {
                trendsMap[weekKey] = {
                    week: weekKey,
                    income: 0,
                    expense: 0,
                };
            }

            if (record.type === "INCOME") {
                trendsMap[weekKey].income += record.amount;
            } else {
                trendsMap[weekKey].expense += record.amount;
            }
        }

        return Object.values(trendsMap).sort((a, b) =>
            a.week.localeCompare(b.week)
        );
    } catch (error) {
        throw new ApiError("Failed to fetch weekly trends", 500);
    }
};
