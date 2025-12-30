import { createClient } from '@supabase/supabase-js';

// Obtener credenciales de variables de entorno
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cvvuudtkgqngceqdopbu.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_yENoh79IhD_udb8rxatdfg_lXwfjgNh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para operaciones administrativas (usar con cuidado)
// Solo usar en servidor/backend, nunca exponer la secret key en el cliente
const supabaseSecretKey = process.env.REACT_APP_SUPABASE_SECRET_KEY;

export const supabaseAdmin = supabaseSecretKey
  ? createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

