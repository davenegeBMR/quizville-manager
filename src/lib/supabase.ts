
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://your-project-url.supabase.co',
  supabaseAnonKey || 'your-anon-key'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== undefined &&
    supabaseAnonKey !== undefined &&
    supabaseUrl !== '' &&
    supabaseAnonKey !== '' &&
    supabaseUrl !== 'https://your-project-url.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};
