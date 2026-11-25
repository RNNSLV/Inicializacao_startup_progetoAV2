import {createClient, type SupabaseClient} from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(
    typeof url === 'string' &&
      url.startsWith('https://') &&
      typeof anonKey === 'string' &&
      anonKey.length > 20,
  );
}

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas.',
    );
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return cachedClient;
}
