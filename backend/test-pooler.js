// Test Supabase Pooler Connection
require('dotenv').config();
const { Client } = require('pg');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.log('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

console.log('🔍 Testing Supabase Pooler Connection...\n');
console.log('📍 Connection URL:', dbUrl.replace(/:[^:@]+@/, ':****@'));
console.log('');

const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
});

async function test() {
    try {
        console.log('⏳ Connecting...');
        await client.connect();
        console.log('✅ Connected successfully!\n');

        const result = await client.query('SELECT version(), current_database(), current_user');
        console.log('📊 Database Info:');
        console.log(`   PostgreSQL: ${result.rows[0].version.split(' ')[1]}`);
        console.log(`   Database: ${result.rows[0].current_database}`);
        console.log(`   User: ${result.rows[0].current_user}`);
        console.log('');

        const tableCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log(`📋 Tables in database: ${tableCheck.rows[0].count}`);
        console.log('');
        console.log('🎉 Connection successful! You can now run:');
        console.log('   npx prisma generate');
        console.log('   npx prisma migrate dev --name init');

        await client.end();
        process.exit(0);
    } catch (error) {
        console.log('❌ Connection failed!');
        console.log(`Error: ${error.message}`);
        console.log('');
        console.log('💡 Troubleshooting:');
        console.log('1. Verify the connection string from Supabase Dashboard');
        console.log('2. Make sure you copied the "Session" pooler URI');
        console.log('3. Check that password is URL-encoded (@ becomes %40)');
        console.log('4. Ensure database is not paused');

        await client.end().catch(() => { });
        process.exit(1);
    }
}

test();
