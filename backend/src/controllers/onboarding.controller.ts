import { Response } from 'express';
import { AuthRequest } from '../types/request';
import { OnboardingService } from '../services/onboarding.service';
import { successResponse, errorResponse } from '../utils/responses';
import { messages } from '../constants/messages';

export class OnboardingController {
    private onboardingService: OnboardingService;

    constructor() {
        this.onboardingService = new OnboardingService();
    }

    complete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.onboardingService.completeOnboarding(userId, req.body);
            successResponse(res, 'Onboarding completed successfully', result, 201);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };

    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.onboardingService.getProfile(userId);
            successResponse(res, 'Profile retrieved successfully', result);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };

    update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.onboardingService.updateProfile(userId, req.body);
            successResponse(res, messages.USER.PROFILE_UPDATED, result);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };
}
