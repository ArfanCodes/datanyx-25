// Test multiple Supabase connection formats
require('dotenv').config();
const { Client } = require('pg');

const projectRef = 'iwedvgyucyqaghirtxbl';
const password = process.env.DATABASE_URL?.match(/:([^@]+)@/)?.[1] || 'YOUR_PASSWORD';

const connectionStrings = [
    // Format 1: Direct connection (db.*.supabase.co:5432)
    `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,

    // Format 2: Session pooler (aws-*.pooler.supabase.com:6543)
    `postgresql://postgres.${projectRef}:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,

    // Format 3: Transaction pooler (aws-*.pooler.supabase.com:5432)
    `postgresql://postgres.${projectRef}:${password}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,

    // Format 4: Direct with postgres prefix
    `postgresql://postgres.${projectRef}:${password}@db.${projectRef}.supabase.co:5432/postgres`,
];

async function testConnection(connectionString, index) {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    });

    try {
        console.log(`\n🔍 Testing Format ${index + 1}...`);
        console.log(`📍 Host: ${connectionString.match(/@([^/]+)/)?.[1]}`);

        await client.connect();
        const result = await client.query('SELECT version()');

        console.log(`✅ SUCCESS! This format works!`);
        console.log(`📊 PostgreSQL version: ${result.rows[0].version.substring(0, 50)}...`);
        console.log(`\n🎉 Use this connection string in your .env:`);
        console.log(`DATABASE_URL="${connectionString}"`);

        await client.end();
        return true;
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        await client.end().catch(() => { });
        return false;
    }
}

async function testAll() {
    console.log('🚀 Testing Supabase connection formats...\n');
    console.log(`Project Ref: ${projectRef}`);
    console.log(`Password: ${'*'.repeat(password.length)}\n`);

    for (let i = 0; i < connectionStrings.length; i++) {
        const success = await testConnection(connectionStrings[i], i);
        if (success) {
            process.exit(0);
        }
    }

    console.log('\n❌ All connection formats failed.');
    console.log('\n💡 Possible issues:');
    console.log('1. Wrong password - verify in Supabase dashboard');
    console.log('2. Database is paused - check Supabase dashboard');
    console.log('3. Firewall blocking connection - try different network');
    console.log('4. Wrong region - check your project region in Supabase');

    process.exit(1);
}

testAll();
