import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  profile: { full_name: string; room_number: string | null; phone: string | null } | null;
  refreshUserData: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, roomNumber: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string; room_number: string | null; phone: string | null } | null>(null);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch roles (array) to avoid maybeSingle issues when multiple roles exist
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      const roles = rolesData ?? [];
      setIsAdmin(roles.some((r) => r.role === "admin"));

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, room_number, phone")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);
    } catch (error) {
      // Keep logs minimal; no sensitive info
      console.error("Error fetching user data");
      setIsAdmin(false);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) return;
    setIsLoading(true);
    await fetchUserData(currentUser.id);
  }, [fetchUserData]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Defer data fetch
        setTimeout(() => {
          setIsLoading(true);
          fetchUserData(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setProfile(null);
        setIsLoading(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsLoading(true);
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signUp = async (email: string, password: string, fullName: string, roomNumber: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          room_number: roomNumber,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Immediately fetch user data after successful login
    if (!error && data.user) {
      setIsLoading(true);
      await fetchUserData(data.user.id);
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setProfile(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, profile, refreshUserData, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

