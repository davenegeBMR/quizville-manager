
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Instead of checking if the variables are undefined, we'll check if they're using the default values
  return (
    supabaseUrl !== 'https://your-project-url.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl !== '' && 
    supabaseAnonKey !== ''
  );
};
