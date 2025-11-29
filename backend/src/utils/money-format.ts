export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatCompactCurrency = (amount: number, currency: string = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        notation: 'compact',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const parseCurrency = (value: string): number => {
    // Remove currency symbols and commas, then parse
    const cleaned = value.replace(/[₹$,]/g, '').trim();
    return parseFloat(cleaned);
};

export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
};
