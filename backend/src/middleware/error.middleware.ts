import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responses';
import { messages } from '../constants/messages';

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        errorResponse(res, err.message, err.stack, err.statusCode);
        return;
    }

    // Log unexpected errors
    console.error('Unexpected error:', err);

    errorResponse(
        res,
        messages.GENERAL.INTERNAL_ERROR,
        process.env.NODE_ENV === 'development' ? err.stack : undefined,
        500
    );
};

export const notFoundHandler = (req: Request, res: Response): void => {
    errorResponse(res, messages.GENERAL.NOT_FOUND, `Route ${req.url} not found`, 404);
};
