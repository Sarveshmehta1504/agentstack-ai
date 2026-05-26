import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // Bypass if token is mock-jwt
  if (token === 'mock-jwt-token-xyz') {
    req.user = {
      id: 'mock-usr-admin',
      email: 'mock-admin@agentstack.ai'
    };
    return next();
  }

  if (!isSupabaseConfigured || !supabase) {
    return res.status(401).json({ error: 'Auth system not configured' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    req.user = {
      id: user.id,
      email: user.email || ''
    };
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth middleware internal failure' });
  }
};
