// Validate and show your DATABASE_URL format
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

console.log('🔍 Checking your DATABASE_URL format...\n');

if (!dbUrl) {
    console.log('❌ DATABASE_URL is not set in .env file!');
    process.exit(1);
}

console.log('📝 Your DATABASE_URL (password hidden):');
console.log(dbUrl.replace(/:[^:@]+@/, ':****@'));
console.log('');

// Parse the URL
try {
    const url = new URL(dbUrl);

    console.log('✅ URL Structure:');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Username: ${url.username}`);
    console.log(`   Password: ${'*'.repeat(url.password.length)} (${url.password.length} chars)`);
    console.log(`   Hostname: ${url.hostname}`);
    console.log(`   Port: ${url.port}`);
    console.log(`   Database: ${url.pathname.substring(1)}`);
    console.log(`   Params: ${url.search || 'none'}`);
    console.log('');

    // Validate
    const issues = [];

    if (url.protocol !== 'postgresql:') {
        issues.push(`❌ Protocol should be 'postgresql:' not '${url.protocol}'`);
    }

    if (url.username !== 'postgres') {
        issues.push(`❌ Username should be 'postgres' not '${url.username}'`);
    }

    if (!url.hostname.includes('supabase.co')) {
        issues.push(`❌ Hostname should contain 'supabase.co', got '${url.hostname}'`);
    }

    if (url.port !== '5432' && url.port !== '6543') {
        issues.push(`⚠️  Port is '${url.port}', should be 5432 or 6543`);
    }

    if (url.pathname !== '/postgres') {
        issues.push(`⚠️  Database path is '${url.pathname}', should be '/postgres'`);
    }

    if (issues.length > 0) {
        console.log('🚨 Issues found:\n');
        issues.forEach(issue => console.log(issue));
        console.log('\n📋 Correct format should be:');
        console.log('DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.iwedvgyucyqaghirtxbl.supabase.co:5432/postgres"');
    } else {
        console.log('✅ DATABASE_URL format looks correct!');
        console.log('\n💡 If connection still fails, the issue might be:');
        console.log('   1. Wrong password');
        console.log('   2. Database paused');
        console.log('   3. Firewall/network blocking connection');
        console.log('   4. Special characters in password not URL-encoded');
    }

} catch (error) {
    console.log('❌ DATABASE_URL is malformed!');
    console.log(`Error: ${error.message}`);
    console.log('\n📋 Correct format:');
    console.log('DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.iwedvgyucyqaghirtxbl.supabase.co:5432/postgres"');
}
