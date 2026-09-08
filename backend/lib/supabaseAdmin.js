import { createClient } from '@supabase/supabase-js';

// This uses the service role key, which skips RLS entirely — so it's only
// ever used server-side, and every query built with it in the controllers
// still has to filter by user_id manually. Don't reuse this client for
// anything that takes untrusted input without double-checking that.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
