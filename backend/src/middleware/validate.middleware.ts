import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/responses';
import { messages } from '../constants/messages';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                errorResponse(
                    res,
                    messages.GENERAL.VALIDATION_ERROR,
                    JSON.stringify(errorMessages),
                    400
                );
                return;
            }

            errorResponse(res, messages.GENERAL.INTERNAL_ERROR, 'Validation error', 500);
            return;
        }
    };
};
