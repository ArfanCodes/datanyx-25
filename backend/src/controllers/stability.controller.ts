import { Response } from 'express';
import { AuthRequest } from '../types/request';
import { successResponse, errorResponse } from '../utils/responses';
import { StabilityService } from '../services/stability.service';

const stabilityService = new StabilityService();

export const getStability = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const log = await stabilityService.getLatestScore(userId);

        if (!log) {
            // If no log exists, calculate one
            const newLog = await stabilityService.calculateStability(userId);
            return successResponse(res, newLog);
        }

        return successResponse(res, log);
    } catch (error: any) {
        console.error('Get stability error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};

export const updateStability = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorResponse(res, 'User not found', 404);

        const log = await stabilityService.calculateStability(userId);

        return successResponse(res, log);
    } catch (error: any) {
        console.error('Update stability error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
};
