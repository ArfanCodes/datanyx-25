import { Response } from 'express';
import { AuthRequest } from '../types/request';
import prisma from '../config/prisma';
import { successResponse, errorResponse } from '../utils/responses';
import { z } from 'zod';

const updateProfileSchema = z.object({
    profession: z.string().optional(),
    salary: z.number().min(0).optional(),
    creditscore: z.number().min(300).max(900).optional(),
    dependents: z.number().min(0).optional(),
    age: z.number().min(18).optional(),
    city: z.string().optional(),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { email: true, name: true, phone: true } } },
        });

        if (!profile) return errorResponse(res, 'Profile not found', 404);

        return successResponse(res, profile);
    } catch (error: any) {
        console.error('Get profile error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const validation = updateProfileSchema.safeParse(req.body);
        if (!validation.success) {
            return errorResponse(res, validation.error.errors[0].message);
        }

        const { profession, salary, creditscore, dependents, age, city } = validation.data;

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                occupation: profession,
                monthlyIncome: salary,
                creditScore: creditscore,
                dependents,
                age,
                city,
            },
        });

        return successResponse(res, updatedProfile);
    } catch (error: any) {
        console.error('Update profile error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};
