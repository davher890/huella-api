import { createClient } from "@supabase/supabase-js"

// Uses the service role key: server-side only, never import this from
// code that could end up in the client bundle.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
