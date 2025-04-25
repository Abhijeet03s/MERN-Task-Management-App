import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
   console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithEmail = async (email, password) => {
   return await supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (email, password, metadata = {}) => {
   return await supabase.auth.signUp({
      email,
      password,
      options: {
         data: {
            ...metadata
         }
      }
   });
};

export const signOut = async () => {
   return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
   const { data, error } = await supabase.auth.getUser();
   if (error) throw error;
   return data?.user;
};

export const getSession = async () => {
   const { data, error } = await supabase.auth.getSession();
   if (error) throw error;
   return data.session;
};

export const updateUserMetadata = async (metadata) => {
   return await supabase.auth.updateUser({
      data: metadata
   });
}; 