require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'exists' : 'missing',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'exists' : 'missing'
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;