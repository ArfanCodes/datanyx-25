interface Transaction {
    amount: number;
    category: string;
    type: string;
    date: Date;
}

interface DetectedLeak {
    category: string;
    amount: number;
    frequency: string;
    severity: string;
    description: string;
}

export class LeakDetector {
    /**
     * Detect money leaks from transaction patterns
     */
    static detectLeaks(transactions: Transaction[]): DetectedLeak[] {
        const leaks: DetectedLeak[] = [];

        // Group transactions by category
        const categoryGroups = this.groupByCategory(transactions);

        for (const [category, txns] of Object.entries(categoryGroups)) {
            const expenseTxns = txns.filter(t => t.type === 'expense');

            if (expenseTxns.length < 3) continue; // Need at least 3 transactions

            const avgAmount = this.calculateAverage(expenseTxns.map(t => t.amount));
            const frequency = this.detectFrequency(expenseTxns);
            const monthlyImpact = this.calculateMonthlyImpact(avgAmount, frequency);

            // Detect if it's a leak based on frequency and amount
            if (this.isLeak(frequency, monthlyImpact)) {
                leaks.push({
                    category,
                    amount: avgAmount,
                    frequency,
                    severity: this.calculateSeverity(monthlyImpact),
                    description: `Recurring ${category} expenses detected`,
                });
            }
        }

        return leaks;
    }

    private static groupByCategory(transactions: Transaction[]): Record<string, Transaction[]> {
        return transactions.reduce((acc, txn) => {
            if (!acc[txn.category]) acc[txn.category] = [];
            acc[txn.category].push(txn);
            return acc;
        }, {} as Record<string, Transaction[]>);
    }

    private static calculateAverage(amounts: number[]): number {
        return amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    }

    private static detectFrequency(transactions: Transaction[]): string {
        const sortedDates = transactions.map(t => t.date).sort((a, b) => a.getTime() - b.getTime());
        const intervals: number[] = [];

        for (let i = 1; i < sortedDates.length; i++) {
            const diff = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
            intervals.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
        }

        const avgInterval = this.calculateAverage(intervals);

        if (avgInterval <= 2) return 'daily';
        if (avgInterval <= 10) return 'weekly';
        return 'monthly';
    }

    private static calculateMonthlyImpact(amount: number, frequency: string): number {
        switch (frequency) {
            case 'daily':
                return amount * 30;
            case 'weekly':
                return amount * 4;
            case 'monthly':
                return amount;
            default:
                return amount;
        }
    }

    private static isLeak(frequency: string, monthlyImpact: number): boolean {
        // Consider it a leak if it's recurring and has significant monthly impact
        return (frequency === 'daily' || frequency === 'weekly') && monthlyImpact > 500;
    }

    private static calculateSeverity(monthlyImpact: number): string {
        if (monthlyImpact > 5000) return 'high';
        if (monthlyImpact > 2000) return 'medium';
        return 'low';
    }
}
