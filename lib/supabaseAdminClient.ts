import { createClient } from "@supabase/supabase-js"

// Usa la service role key: solo para rutas /api/admin/*, nunca importar
// desde codigo que pueda acabar en el bundle del cliente.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
