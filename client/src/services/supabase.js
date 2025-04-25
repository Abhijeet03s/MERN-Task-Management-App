import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
   console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helpers
export const signInWithEmail = async (email, password) => {
   return await supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (email, password) => {
   return await supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
   return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
   const { data, error } = await supabase.auth.getUser();
   if (error) throw error;
   return data?.user;
};

// Returns the current session
export const getSession = async () => {
   const { data, error } = await supabase.auth.getSession();
   if (error) throw error;
   return data.session;
}; 