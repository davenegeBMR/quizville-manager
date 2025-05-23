import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase, ProfilesRow, profilesTable } from '@/integrations/supabase/client';
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
  
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);
            
            if (event === 'SIGNED_IN' && newSession) {
              try {
                // Use the profilesTable helper to ensure type safety
                const { data: profile, error: profileError } = await profilesTable()
                  .select('*')
                  .eq('id', newSession.user.id)
                  .single();
                  
                if (profile) {
                  const user: User = {
                    id: profile.id,
                    username: profile.username,
                    role: profile.role as UserRole,
                    email: newSession.user.email || ''
                  };
                  setCurrentUser(user);
                  setIsAuthenticated(true);
                } else {
                  const user: User = {
                    id: newSession.user.id,
                    username: newSession.user.email?.split('@')[0] || 'user',
                    role: 'student',
                    email: newSession.user.email || ''
                  };
                  setCurrentUser(user);
                  setIsAuthenticated(true);
                }
              } catch (error) {
                console.error('Error getting user profile:', error);
                const user: User = {
                  id: newSession.user.id,
                  username: newSession.user.email?.split('@')[0] || 'user',
                  role: 'student',
                  email: newSession.user.email || ''
                };
                setCurrentUser(user);
                setIsAuthenticated(true);
              }
            }
            
            if (event === 'SIGNED_OUT') {
              setCurrentUser(null);
              setIsAuthenticated(false);
              setSession(null);
            }
          }
        );

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (currentSession) {
          setSession(currentSession);
          
          try {
            // Use the profilesTable helper to ensure type safety
            const { data: profile, error: profileError } = await profilesTable()
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (profile) {
              const user: User = {
                id: profile.id,
                username: profile.username,
                role: profile.role as UserRole,
                email: currentSession.user.email || ''
              };
              setCurrentUser(user);
              setIsAuthenticated(true);
            } else {
              const user: User = {
                id: currentSession.user.id,
                username: currentSession.user.email?.split('@')[0] || 'user',
                role: 'student',
                email: currentSession.user.email || ''
              };
              setCurrentUser(user);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error getting user profile:', error);
            const user: User = {
              id: currentSession.user.id,
              username: currentSession.user.email?.split('@')[0] || 'user',
              role: 'student',
              email: currentSession.user.email || ''
            };
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        }

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Supabase auth failed, trying mock authentication:', error);
        
        const mockUser = mockUsers.find(
          (user) => user.email === email && user.password === password
        );

        if (mockUser) {
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

      if (data.session) {
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
      await supabase.auth.signOut();
      
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
