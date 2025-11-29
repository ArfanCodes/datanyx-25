import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../types/request';
import { errorResponse } from '../utils/responses';

export const verifyAuthToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return errorResponse(res, 'Missing or invalid authorization header', 401);
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return errorResponse(res, 'Invalid or expired token', 401);
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email || '',
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return errorResponse(res, 'Internal authentication error', 500);
    }
};
