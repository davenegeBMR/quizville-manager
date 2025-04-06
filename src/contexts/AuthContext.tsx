
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { mockUsers } from '@/services/mockDatabase';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    // Initialize the auth state from Supabase session
    const initializeAuth = async () => {
      setLoading(true);
      
      if (supabaseConfigured) {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          setSession(session);
          
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error getting user profile:', profileError);
          } else if (profile) {
            const user: User = {
              id: profile.id,
              username: profile.username,
              role: profile.role,
              email: session.user.email || ''
            };
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        }
      }
      
      setLoading(false);
    };

    if (supabaseConfigured) {
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          
          if (event === 'SIGNED_IN' && newSession) {
            // Get user profile data
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
              
            if (profile) {
              const user: User = {
                id: profile.id,
                username: profile.username,
                role: profile.role,
                email: newSession.user.email || ''
              };
              setCurrentUser(user);
              setIsAuthenticated(true);
            }
          }
          
          if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
      );

      // Initialize auth state
      initializeAuth();

      // Clean up subscription when component unmounts
      return () => {
        subscription?.unsubscribe();
      };
    } else {
      // If Supabase is not configured, initialize with mock data
      setLoading(false);
    }
  }, [supabaseConfigured]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // If Supabase is not configured, use mock authentication
      if (!supabaseConfigured) {
        const mockUser = mockUsers.find(
          (user) => user.email === email && user.password === password
        );

        if (mockUser) {
          // Create a mock user without the password
          const authenticatedUser: User = {
            id: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            role: mockUser.role
          };
          
          setCurrentUser(authenticatedUser);
          setIsAuthenticated(true);
          
          toast({
            title: "Login Successful",
            description: "You have been successfully logged in using mock data.",
          });
          
          return true;
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password",
            variant: "destructive"
          });
          return false;
        }
      }

      // Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.session) {
        // Session is handled by the auth state change listener
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in.",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          toast({
            title: "Logout Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Clear local state regardless of Supabase configuration
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSession(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive"
      });
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, session, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
