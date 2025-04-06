
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Supabase integration
// Use fallback values for development to prevent runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL !== undefined && 
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-url.supabase.co'
  );
};
