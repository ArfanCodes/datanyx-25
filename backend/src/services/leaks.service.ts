import prisma from '../config/prisma';
import { LeakDetector } from '../utils/leak-detector';
import { messages } from '../constants/messages';

export class LeakService {
    async getAllLeaks(userId: string) {
        return await prisma.leak.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async detectLeaks(userId: string) {
        const transactions = await prisma.transaction.findMany({
            where: { userId, type: 'expense' },
            orderBy: { date: 'desc' },
            take: 100, // Analyze last 100 transactions
        });

        const detectedLeaks = LeakDetector.detectLeaks(transactions);

        // Save detected leaks to database
        const savedLeaks = await Promise.all(
            detectedLeaks.map(leak =>
                prisma.leak.create({
                    data: {
                        userId,
                        ...leak,
                    },
                })
            )
        );

        return savedLeaks;
    }

    async deleteLeak(id: string, userId: string) {
        const leak = await prisma.leak.findFirst({
            where: { id, userId },
        });

        if (!leak) {
            throw new Error(messages.LEAK.NOT_FOUND);
        }

        await prisma.leak.delete({
            where: { id },
        });
    }
}
