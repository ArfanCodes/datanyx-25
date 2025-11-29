import prisma from '../config/prisma';
import { messages } from '../constants/messages';
import { StabilityMode } from '@prisma/client';

export class StabilityService {
    async getLatestScore(userId: string) {
        const latestLog = await prisma.stabilityLog.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (!latestLog) {
            // If no log, return a default one or throw
            // For API friendliness, maybe return null or default
            return null;
        }

        return latestLog;
    }

    async getScoreHistory(userId: string) {
        return await prisma.stabilityLog.findMany({
            where: { userId },
            orderBy: { month: 'desc' },
            take: 12, // Last 12 months
        });
    }

    async calculateStability(userId: string) {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 90, // Last 90 days
        });

        // Calculate stability metrics
        const income = transactions.filter(t => t.type === 'INCOME');
        const expenses = transactions.filter(t => t.type === 'EXPENSE');

        const avgIncome = income.reduce((sum, t) => sum + t.amount, 0) / (income.length || 1);
        const avgExpense = expenses.reduce((sum, t) => sum + t.amount, 0) / (expenses.length || 1);

        const incomeStability = this.calculateVariance(income.map(t => t.amount));
        const expensePattern = this.calculateVariance(expenses.map(t => t.amount));
        const savingsRate = avgIncome > 0 ? ((avgIncome - avgExpense) / avgIncome) * 100 : 0;

        const stabilityScore = this.computeStabilityScore(incomeStability, expensePattern, savingsRate);
        const mode = this.determineMode(stabilityScore);

        // Save to database
        const log = await prisma.stabilityLog.create({
            data: {
                userId,
                stabilityScore,
                mode,
                incomeStability,
                expensePattern,
                savingsRate,
                month: new Date(),
                insights: this.generateInsights(mode, savingsRate),
                recommendations: this.generateRecommendations(mode),
            },
        });

        return log;
    }

    private calculateVariance(values: number[]): number {
        if (values.length === 0) return 0;
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    private computeStabilityScore(incomeStability: number, expensePattern: number, savingsRate: number): number {
        // Simple scoring algorithm
        // Lower variance is better. Higher savings rate is better.
        // Normalize variance: assume 0-1000 range, map to 100-0
        const incomeScore = Math.max(0, 100 - (incomeStability / 100));
        const expenseScore = Math.max(0, 100 - (expensePattern / 100));
        const savingsScore = Math.min(100, Math.max(0, savingsRate * 2)); // Cap at 100, scale up

        return Math.round(incomeScore * 0.4 + expenseScore * 0.3 + savingsScore * 0.3);
    }

    private determineMode(score: number): StabilityMode {
        if (score >= 80) return StabilityMode.STABLE;
        if (score >= 60) return StabilityMode.MODERATE;
        if (score >= 40) return StabilityMode.UNSTABLE;
        return StabilityMode.EMERGENCY;
    }

    private generateInsights(mode: StabilityMode, savingsRate: number): string[] {
        const insights = [`Your financial mode is ${mode}`];
        if (savingsRate > 20) insights.push('Great savings rate!');
        else if (savingsRate > 0) insights.push('You are saving a bit, try to increase it.');
        else insights.push('You are spending more than you earn.');
        return insights;
    }

    private generateRecommendations(mode: StabilityMode): string[] {
        switch (mode) {
            case StabilityMode.STABLE:
                return ['Consider investing surplus income', 'Review long-term goals'];
            case StabilityMode.MODERATE:
                return ['Track discretionary spending', 'Build emergency fund'];
            case StabilityMode.UNSTABLE:
                return ['Cut unnecessary subscriptions', 'Avoid new debt'];
            case StabilityMode.EMERGENCY:
                return ['Immediate spending freeze', 'Contact creditors if needed'];
            default:
                return [];
        }
    }
}
