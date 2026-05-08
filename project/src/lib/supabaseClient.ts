// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ❗ Use the right env access for your bundler:
// - Vite: import.meta.env.VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// - CRA:  process.env.REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY
// - Next: process.env.NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase env vars missing.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
