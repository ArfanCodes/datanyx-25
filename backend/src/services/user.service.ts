import prisma from '../config/prisma';
import { messages } from '../constants/messages';

export class UserService {
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                createdAt: true,
                profile: true,
            },
        });

        if (!user) {
            throw new Error(messages.AUTH.USER_NOT_FOUND);
        }

        return user;
    }

    async updateProfile(userId: string, data: { name?: string; phone?: string }) {
        return await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
            },
        });
    }

    async deleteAccount(userId: string) {
        await prisma.user.delete({
            where: { id: userId },
        });
    }
}
