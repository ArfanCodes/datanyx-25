import { Response } from 'express';
import { AuthRequest } from '../types/request';
import { DashboardService } from '../services/dashboard.service';
import { successResponse, errorResponse } from '../utils/responses';
import { messages } from '../constants/messages';

export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    getSummary = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.dashboardService.getDashboardSummary(userId);
            successResponse(res, 'Dashboard summary retrieved', result);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };

    getStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.dashboardService.getStats(userId);
            successResponse(res, 'Stats retrieved', result);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };
}
