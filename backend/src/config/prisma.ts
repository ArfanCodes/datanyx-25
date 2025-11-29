import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // Force pgbouncer=true to avoid "prepared statement already exists" error
    // This is critical for Supabase Transaction Mode poolers
    const url = process.env.DATABASE_URL;
    const urlWithPgbouncer = url && !url.includes('pgbouncer=true')
        ? `${url}${url.includes('?') ? '&' : '?'}pgbouncer=true`
        : url;

    return new PrismaClient({
        datasources: {
            db: {
                url: urlWithPgbouncer,
            },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
