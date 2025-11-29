import { Response } from 'express';
import { AuthRequest } from '../types/request';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/responses';
import { messages } from '../constants/messages';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.userService.getProfile(userId);
            successResponse(res, 'Profile retrieved', result);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };

    updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.userService.updateProfile(userId, req.body);
            successResponse(res, messages.USER.PROFILE_UPDATED, result);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };

    deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            await this.userService.deleteAccount(userId);
            successResponse(res, messages.USER.USER_DELETED);
        } catch (error: any) {
            errorResponse(res, error.message || messages.GENERAL.ERROR);
        }
    };
}
