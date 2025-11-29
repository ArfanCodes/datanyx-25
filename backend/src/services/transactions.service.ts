import prisma from '../config/prisma';
import { TransactionInput } from '../utils/validators';
import { messages } from '../constants/messages';

export class TransactionService {
    async getAllTransactions(userId: string) {
        return await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }

    async getTransactionById(id: string, userId: string) {
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!transaction) {
            throw new Error(messages.TRANSACTION.NOT_FOUND);
        }

        return transaction;
    }

    async createTransaction(userId: string, data: TransactionInput) {
        return await prisma.transaction.create({
            data: {
                userId,
                ...data,
                date: data.date ? new Date(data.date) : new Date(),
            },
        });
    }

    async updateTransaction(id: string, userId: string, data: Partial<TransactionInput>) {
        const transaction = await this.getTransactionById(id, userId);

        return await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
        });
    }

    async deleteTransaction(id: string, userId: string) {
        const transaction = await this.getTransactionById(id, userId);

        await prisma.transaction.delete({
            where: { id: transaction.id },
        });
    }
}
