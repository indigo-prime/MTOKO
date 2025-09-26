// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a real client only when env vars are present. Otherwise, export a proxy
// that throws a helpful error only when used. This prevents build-time crashes
// when env vars are not injected (e.g., on Vercel during static analysis).
const realClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Minimal "Supabase-like" proxy that throws on method access if not configured.
const supabaseProxy: any = new Proxy(
  {},
  {
    get() {
      throw new Error(
        'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    },
  }
);

export const supabase = (realClient ?? supabaseProxy);
