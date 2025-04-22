
import { supabase } from "@/integrations/supabase/client";

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  try {
    return !!supabase;
  } catch (error) {
    console.error("Supabase configuration error:", error);
    return false;
  }
};

// Helper function for admin operations
export const adminCreateUser = async (email: string, password: string, userData: { username: string; role: string }) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      throw authError;
    }

    if (authData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', authData.user.id);

      if (profileError) {
        throw profileError;
      }
      
      return { data: authData, error: null };
    }
    
    return { data: null, error: new Error('User creation failed') };
  } catch (error) {
    console.error('Error in adminCreateUser:', error);
    return { data: null, error };
  }
};
