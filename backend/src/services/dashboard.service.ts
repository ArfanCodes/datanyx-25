import prisma from '../config/prisma';

export class DashboardService {
    async getDashboardSummary(userId: string) {
        const [transactions, leaks, latestStability] = await Promise.all([
            prisma.transaction.findMany({ where: { userId } }),
            prisma.leak.findMany({ where: { userId } }),
            prisma.stabilityLog.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

        return {
            totalIncome,
            totalExpenses,
            balance,
            savingsRate,
            stabilityScore: latestStability?.stabilityScore || 0,
            leaksDetected: leaks.length,
        };
    }

    async getStats(userId: string) {
        // Placeholder for additional stats
        return { message: 'Stats endpoint - to be implemented' };
    }
}
