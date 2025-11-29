import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
}

export interface DateRangeQuery {
    startDate?: string;
    endDate?: string;
}
