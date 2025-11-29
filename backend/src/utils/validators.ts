import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().optional(),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Onboarding validators
export const onboardingSchema = z.object({
    monthlyIncome: z.number().positive('Monthly income must be positive'),
    currency: z.string().default('INR'),
    financialGoals: z.array(z.string()).min(1, 'Select at least one financial goal'),
    riskTolerance: z.enum(['low', 'medium', 'high']),
    age: z.number().int().positive().optional(),
    occupation: z.string().optional(),
    city: z.string().optional(),
});

// Transaction validators
export const transactionSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    type: z.enum(['income', 'expense']),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
});

// Leak validators
export const leakSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    amount: z.number().positive('Amount must be positive'),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    description: z.string().optional(),
    severity: z.enum(['low', 'medium', 'high']),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type LeakInput = z.infer<typeof leakSchema>;
