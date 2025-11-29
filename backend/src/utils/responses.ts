import { Response } from 'express';

export const successResponse = <T>(res: Response, data: T, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
        error: null,
    });
};

export const errorResponse = (res: Response, error: string, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        data: null,
        error,
    });
};
