import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('🌱 Starting database seed...\n');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'test@datanyx.com' },
        update: {},
        create: {
            email: 'test@datanyx.com',
            password: hashedPassword,
            name: 'Test User',
            phone: '+1234567890',
            isOnboarded: true,
        },
    });

    console.log('✅ Created user:', user.email);

    // Create profile
    const profile = await prisma.profile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            monthlyIncome: 50000,
            currency: 'INR',
            financialGoals: ['SAVE_EMERGENCY', 'INVESTMENT', 'RETIREMENT'],
            riskTolerance: 'MEDIUM',
            age: 28,
            occupation: 'Software Engineer',
            city: 'Mumbai',
            dependents: 0,
            currentCoachMode: 'BALANCED',
            emergencyFund: 150000,
        },
    });

    console.log('✅ Created profile for user');

    // Create sample transactions
    const transactions = await prisma.transaction.createMany({
        data: [
            // Income
            {
                userId: user.id,
                amount: 50000,
                category: 'salary',
                type: 'INCOME',
                description: 'Monthly salary',
                date: new Date('2025-01-01'),
            },
            // Expenses
            {
                userId: user.id,
                amount: 15000,
                category: 'rent',
                type: 'EXPENSE',
                expenseType: 'FIXED',
                description: 'Monthly rent',
                date: new Date('2025-01-05'),
            },
            {
                userId: user.id,
                amount: 3000,
                category: 'food',
                type: 'EXPENSE',
                expenseType: 'VARIABLE',
                description: 'Groceries',
                date: new Date('2025-01-10'),
            },
            {
                userId: user.id,
                amount: 1500,
                category: 'transport',
                type: 'EXPENSE',
                expenseType: 'VARIABLE',
                description: 'Uber rides',
                date: new Date('2025-01-12'),
            },
            {
                userId: user.id,
                amount: 500,
                category: 'entertainment',
                type: 'EXPENSE',
                expenseType: 'VARIABLE',
                description: 'Movie tickets',
                date: new Date('2025-01-15'),
            },
        ],
    });

    console.log(`✅ Created ${transactions.count} transactions`);

    // Create EMI
    const emi = await prisma.eMI.create({
        data: {
            userId: user.id,
            name: 'Home Loan',
            principalAmount: 2000000,
            interestRate: 8.5,
            tenure: 240, // 20 years
            monthlyEMI: 17200,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2043-01-01'),
            paidInstallments: 24,
            remainingAmount: 1950000,
            lender: 'HDFC Bank',
        },
    });

    console.log('✅ Created EMI:', emi.name);

    // Create subscriptions
    const subscriptions = await prisma.subscription.createMany({
        data: [
            {
                userId: user.id,
                name: 'Netflix',
                amount: 649,
                billingCycle: 'MONTHLY',
                category: 'entertainment',
                status: 'ACTIVE',
                startDate: new Date('2024-01-01'),
                nextBillingDate: new Date('2025-02-01'),
            },
            {
                userId: user.id,
                name: 'Spotify',
                amount: 119,
                billingCycle: 'MONTHLY',
                category: 'entertainment',
                status: 'ACTIVE',
                startDate: new Date('2024-06-01'),
                nextBillingDate: new Date('2025-02-01'),
            },
            {
                userId: user.id,
                name: 'Amazon Prime',
                amount: 1499,
                billingCycle: 'MONTHLY',
                category: 'shopping',
                status: 'ACTIVE',
                startDate: new Date('2024-01-15'),
                nextBillingDate: new Date('2026-01-15'),
            },
        ],
    });

    console.log(`✅ Created ${subscriptions.count} subscriptions`);

    // Create budget
    const budget = await prisma.budget.create({
        data: {
            userId: user.id,
            category: 'food',
            limit: 8000,
            spent: 3000,
            period: 'monthly',
            alertAt: 80,
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-01-31'),
        },
    });

    console.log('✅ Created budget for food category');

    // Create savings goal
    const goal = await prisma.savingsGoal.create({
        data: {
            userId: user.id,
            name: 'Emergency Fund',
            targetAmount: 300000,
            currentAmount: 150000,
            category: 'SAVE_EMERGENCY',
            priority: 1,
            deadline: new Date('2025-12-31'),
        },
    });

    console.log('✅ Created savings goal:', goal.name);

    // Create stability log
    const stabilityLog = await prisma.stabilityLog.create({
        data: {
            userId: user.id,
            stabilityScore: 75.5,
            mode: 'STABLE',
            incomeStability: 95.0,
            expensePattern: 70.0,
            savingsRate: 30.0,
            debtRatio: 40.0,
            emergencyFund: 3.0,
            insights: [
                'Your income is very stable',
                'Expenses are consistent',
                'Good savings rate',
            ],
            recommendations: [
                'Consider increasing emergency fund to 6 months',
                'Look into investment opportunities',
            ],
            month: new Date('2025-01-01'),
        },
    });

    console.log('✅ Created stability log');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   User: ${user.email}`);
    console.log(`   Password: password123`);
    console.log(`   Transactions: ${transactions.count}`);
    console.log(`   Subscriptions: ${subscriptions.count}`);
    console.log(`   EMI: 1`);
    console.log(`   Budget: 1`);
    console.log(`   Savings Goal: 1`);
    console.log(`   Stability Log: 1`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
