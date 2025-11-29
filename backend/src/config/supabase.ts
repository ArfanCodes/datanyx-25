import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL or Key is missing in .env file.');
    console.error('   Please ensure your .env file contains SUPABASE_URL and SUPABASE_ANON_KEY.');

    // Create a dummy client that throws intelligible errors when used
    // This allows the server to start even if config is missing, but auth will fail
    supabase = {
        auth: {
            getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env') }),
            signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env') }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env') }),
            admin: {
                createUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
            }
        },
    } as unknown as SupabaseClient;
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
