import { supabaseAdmin } from '../lib/supabaseAdmin.js';

// Every protected route runs this first. We don't trust a user id coming
// from the request body or params — the only identity that counts is
// whatever Supabase says the token belongs to, checked fresh on each call.
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.user = data.user;
  next();
}
