
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
    console.log("Checking Supabase connection...");
    try {
        const { data, error } = await supabase.from('requests').select('*').limit(1);

        if (error) {
            console.error("Supabase Error:", error.message);
            if (error.code === '42P01') {
                console.error("Hint: The 'requests' table does not exist. Please run the SQL script.");
            }
            process.exit(1);
        }

        console.log("SUCCESS: Connection established and table 'requests' found.");
        process.exit(0);
    } catch (err) {
        console.error("Unexpected Error:", err);
        process.exit(1);
    }
}

checkSupabase();
