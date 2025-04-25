import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase, signOut, getSession, getCurrentUser } from "../services/supabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle sign out
  const handleLogOut = async () => {
    try {
      await signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (session) {
          // Store token in localStorage for API calls
          localStorage.setItem('authToken', session.access_token);
        } else {
          localStorage.removeItem('authToken');
        }

        setLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const initialSession = await getSession();
        setSession(initialSession);

        if (initialSession) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('authToken', initialSession.access_token);
        }
      } catch (error) {
        console.error("Error initializing auth:", error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    handleLogOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
