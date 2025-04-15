import { createClient } from '@supabase/supabase-js';

// Check if the required environment variables are set
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is not set');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY environment variable is not set');
}

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);