import { Response } from 'express';
import { AuthRequest } from '../types/request';
import prisma from '../config/prisma';
import { successResponse, errorResponse } from '../utils/responses';
import { z } from 'zod';
import { TransactionType } from '@prisma/client';

const createTransactionSchema = z.object({
    type: z.enum(['expense', 'income', 'emi', 'subscription']),
    amount: z.number().positive(),
    category: z.string(),
    note: z.string().optional(),
    date: z.string().datetime().optional(), // ISO string
});

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const validation = createTransactionSchema.safeParse(req.body);
        if (!validation.success) {
            return errorResponse(res, validation.error.errors[0].message);
        }

        const { type, amount, category, note, date } = validation.data;

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                type: type.toUpperCase() as TransactionType,
                amount,
                category,
                description: note,
                date: date ? new Date(date) : new Date(),
            },
        });

        return successResponse(res, transaction);
    } catch (error: any) {
        console.error('Create transaction error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const { month, today, type } = req.query;

        const where: any = { userId };

        if (type) {
            where.type = (type as string).toUpperCase() as TransactionType;
        }

        if (today === 'true') {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            where.date = { gte: start, lte: end };
        } else if (month) {
            // month format: YYYY-MM
            const [year, monthNum] = (month as string).split('-');
            const start = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
            const end = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
            where.date = { gte: start, lte: end };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        return successResponse(res, transactions);
    } catch (error: any) {
        console.error('Get transactions error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};
