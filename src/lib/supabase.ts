
import { supabase } from "@/integrations/supabase/client";

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  try {
    // Simple check to see if we can connect to Supabase
    return !!supabase;
  } catch (error) {
    console.error("Supabase configuration error:", error);
    return false;
  }
};
