const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
   db: {
      schema: 'public',
      fetch: {
         cache: 'no-cache'
      }
   }
});

module.exports = supabase;