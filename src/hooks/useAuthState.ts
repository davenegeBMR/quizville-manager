
import { useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase, ProfilesRow, profilesTable } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { mockUsers } from "@/services/mockDatabase";

export function useAuthState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    function safeUpdateProfile(profile: ProfilesRow | null, email: string | null): User {
      if (profile) {
        return {
          id: profile.id,
          username: profile.username,
          role: profile.role as UserRole,
          email: email || ""
        };
      } else {
        return {
          id: "",
          username: email?.split("@")[0] || "user",
          role: "student",
          email: email || ""
        };
      }
    }

    const initializeAuth = async () => {
      setLoading(true);

      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            setSession(newSession);

            if (event === "SIGNED_IN" && newSession) {
              setTimeout(async () => {
                try {
                  const { data: profile } = await profilesTable()
                    .select("*")
                    .eq("id", newSession.user.id)
                    .maybeSingle();

                  const user = safeUpdateProfile(profile, newSession.user.email);
                  setCurrentUser(user);
                  setIsAuthenticated(true);

                } catch {
                  setCurrentUser(safeUpdateProfile(null, newSession.user.email));
                  setIsAuthenticated(true);
                }
              }, 0);
            }

            if (event === "SIGNED_OUT") {
              setCurrentUser(null);
              setIsAuthenticated(false);
              setSession(null);
            }
          }
        );

        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession) {
          setSession(currentSession);
          try {
            const { data: profile } = await profilesTable()
              .select("*")
              .eq("id", currentSession.user.id)
              .maybeSingle();

            const user = safeUpdateProfile(profile, currentSession.user.email);
            setCurrentUser(user);
            setIsAuthenticated(true);

          } catch {
            setCurrentUser(safeUpdateProfile(null, currentSession.user.email));
            setIsAuthenticated(true);
          }
        }

        return () => subscription?.unsubscribe?.();
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
        // fallback to mock users
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

  const isAdmin = currentUser?.role === "admin";

  return {
    currentUser,
    session,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };
}
