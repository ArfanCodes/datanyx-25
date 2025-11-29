import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import * as authService from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/responses';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2),
    phone_number: z.string().min(10),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const signup = async (req: Request, res: Response) => {
    try {
        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            return errorResponse(res, validation.error.errors[0].message);
        }

        const { email, password, full_name, phone_number } = validation.data;

        // 1. Create Supabase Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone_number,
                },
            },
        });

        if (authError) {
            return errorResponse(res, authError.message);
        }

        if (!authData.user) {
            return errorResponse(res, 'Failed to create user');
        }

        // 2. Create Prisma User & Profile
        // Note: If email confirmation is enabled, user might not be able to login yet,
        // but we still create the profile.
        const { user, profile } = await authService.createUserProfile(
            authData.user.id,
            email,
            full_name,
            phone_number
        );

        return successResponse(res, {
            token: authData.session?.access_token,
            user,
            profile,
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        // Handle unique constraint violation (if Prisma fails but Supabase succeeded)
        // Ideally we should rollback Supabase user, but for now just report error.
        return errorResponse(res, error.message || 'Internal server error', 500);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return errorResponse(res, validation.error.errors[0].message);
        }

        const { email, password } = validation.data;

        // 1. Login with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return errorResponse(res, authError.message, 401);
        }

        if (!authData.user || !authData.session) {
            return errorResponse(res, 'Login failed', 401);
        }

        // 2. Fetch Profile
        const userProfile = await authService.getUserProfile(authData.user.id);

        return successResponse(res, {
            session: authData.session,
            user: userProfile,
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};
