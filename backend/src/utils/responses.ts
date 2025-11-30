import { Response } from 'express';

export const successResponse = <T>(res: Response, data: T, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
        error: null,
    });
};

export const errorResponse = (res: Response, error: string, stack?: string | number, statusCode?: number) => {
    // Handle parameter overloading - if stack is a number, it's actually the statusCode
    let actualStatusCode = 400;
    let actualStack: string | undefined;

    if (typeof stack === 'number') {
        actualStatusCode = stack;
    } else {
        actualStack = stack;
        actualStatusCode = statusCode || 400;
    }

    return res.status(actualStatusCode).json({
        success: false,
        data: null,
        error,
        ...(actualStack && { stack: actualStack }),
    });
};
