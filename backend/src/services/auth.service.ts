import prisma from '../config/prisma';

export const createUserProfile = async (
    userId: string,
    email: string,
    name: string,
    phone: string
) => {
    return await prisma.$transaction(async (tx) => {
        // Create User
        // Note: We store a placeholder password because Supabase handles auth,
        // but our Prisma schema still requires a password field.
        const user = await tx.user.create({
            data: {
                id: userId, // Sync ID with Supabase Auth
                email,
                name,
                phone,
                password: 'SUPABASE_AUTH_MANAGED',
                isOnboarded: false,
            },
        });

        // Create Profile
        const profile = await tx.profile.create({
            data: {
                userId: user.id,
                monthlyIncome: 0,
                phone, // Storing phone in profile as requested
            },
        });

        return { user, profile };
    });
};

export const getUserProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });
    return user;
};
