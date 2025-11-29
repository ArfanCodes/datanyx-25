import prisma from '../config/prisma';
import { OnboardingInput } from '../utils/validators';
import { messages } from '../constants/messages';

export class OnboardingService {
    async completeOnboarding(userId: string, data: OnboardingInput) {
        const profile = await prisma.profile.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
        });

        return profile;
    }

    async getProfile(userId: string) {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { id: true, email: true, name: true, phone: true } } },
        });

        if (!profile) {
            throw new Error(messages.USER.PROFILE_NOT_FOUND);
        }

        return profile;
    }

    async updateProfile(userId: string, data: Partial<OnboardingInput>) {
        const profile = await prisma.profile.update({
            where: { userId },
            data,
        });

        return profile;
    }
}
