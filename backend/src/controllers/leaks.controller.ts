import { Response } from 'express';
import { AuthRequest } from '../types/request';
import prisma from '../config/prisma';
import { successResponse, errorResponse } from '../utils/responses';
import { LeakDetector } from '../utils/leak-detector';
import { LeakSeverity, LeakFrequency } from '@prisma/client';

export const analyzeLeaks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        let transactions = req.body.transactions;

        // If no transactions provided, fetch from DB
        if (!transactions || !Array.isArray(transactions)) {
            const dbTransactions = await prisma.transaction.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 100, // Analyze last 100 transactions
            });

            transactions = dbTransactions.map(t => ({
                amount: t.amount,
                category: t.category,
                type: t.type.toLowerCase(),
                date: t.date,
            }));
        } else {
            // Ensure dates are Date objects
            transactions = transactions.map((t: any) => ({
                ...t,
                date: new Date(t.date),
            }));
        }

        const detectedLeaks = LeakDetector.detectLeaks(transactions);

        // Save detected leaks to DB
        // First, delete old unresolved leaks to avoid duplicates or update them?
        // For simplicity, we'll just create new ones if they don't exist, or just return them.
        // The prompt says "Return pre-calculated leak result".
        // But GET /api/leaks returns "most recent detected leaks".
        // So I should save them.

        for (const leak of detectedLeaks) {
            // Check if similar leak exists
            const existing = await prisma.leak.findFirst({
                where: {
                    userId,
                    category: leak.category,
                    isResolved: false,
                },
            });

            if (!existing) {
                await prisma.leak.create({
                    data: {
                        userId,
                        category: leak.category,
                        amount: leak.amount,
                        frequency: leak.frequency.toUpperCase() as LeakFrequency,
                        severity: leak.severity.toUpperCase() as LeakSeverity,
                        description: leak.description,
                        monthlyImpact: leak.amount * (leak.frequency === 'daily' ? 30 : leak.frequency === 'weekly' ? 4 : 1),
                        yearlyImpact: leak.amount * (leak.frequency === 'daily' ? 365 : leak.frequency === 'weekly' ? 52 : 12),
                    },
                });
            }
        }

        return successResponse(res, detectedLeaks);
    } catch (error: any) {
        console.error('Analyze leaks error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};

export const getLeaks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const leaks = await prisma.leak.findMany({
            where: { userId, isResolved: false },
            orderBy: { createdAt: 'desc' },
        });

        return successResponse(res, leaks);
    } catch (error: any) {
        console.error('Get leaks error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};
