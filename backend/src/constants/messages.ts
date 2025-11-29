export const messages = {
    // Auth messages
    AUTH: {
        SUCCESS_LOGIN: 'Login successful',
        SUCCESS_REGISTER: 'Registration successful',
        SUCCESS_LOGOUT: 'Logout successful',
        INVALID_CREDENTIALS: 'Invalid email or password',
        EMAIL_EXISTS: 'Email already exists',
        USER_NOT_FOUND: 'User not found',
        UNAUTHORIZED: 'Unauthorized access',
        TOKEN_EXPIRED: 'Token has expired',
        TOKEN_INVALID: 'Invalid token',
    },

    // User messages
    USER: {
        PROFILE_UPDATED: 'Profile updated successfully',
        PROFILE_NOT_FOUND: 'Profile not found',
        USER_DELETED: 'User deleted successfully',
    },

    // Transaction messages
    TRANSACTION: {
        CREATED: 'Transaction created successfully',
        UPDATED: 'Transaction updated successfully',
        DELETED: 'Transaction deleted successfully',
        NOT_FOUND: 'Transaction not found',
        INVALID_AMOUNT: 'Invalid transaction amount',
    },

    // Leak messages
    LEAK: {
        DETECTED: 'Money leak detected',
        CREATED: 'Leak created successfully',
        UPDATED: 'Leak updated successfully',
        DELETED: 'Leak deleted successfully',
        NOT_FOUND: 'Leak not found',
    },

    // Stability messages
    STABILITY: {
        CALCULATED: 'Stability score calculated successfully',
        INSUFFICIENT_DATA: 'Insufficient data to calculate stability',
    },

    // General messages
    GENERAL: {
        SUCCESS: 'Operation successful',
        ERROR: 'An error occurred',
        VALIDATION_ERROR: 'Validation error',
        NOT_FOUND: 'Resource not found',
        INTERNAL_ERROR: 'Internal server error',
    },
};
