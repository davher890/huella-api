import type { User } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"

export type AuthResult =
  | { user: User; token: string }
  | { error: string; status: number }

// Punto unico donde se valida el Authorization: Bearer <token> de una
// peticion. Cualquier ruta que necesite saber "quien hace esta llamada"
// deberia usar esta funcion en vez de repetir la extraccion/verificacion
// del token.
export async function requireUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (!token) {
    return { error: "Missing Authorization header", status: 401 }
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    return { error: "Invalid or expired token", status: 401 }
  }

  return { user: data.user, token }
}

// Igual que requireUser, pero ademas exige que el usuario tenga role admin.
export async function requireAdmin(req: Request): Promise<AuthResult> {
  const result = await requireUser(req)
  if ("error" in result) {
    return result
  }

  if (result.user.app_metadata?.role !== "admin") {
    return { error: "Forbidden: admin only", status: 403 }
  }

  return result
}

// Cliente de Supabase que ejecuta las queries como el usuario autenticado
// (no como el cliente anon compartido), para que las policies de RLS que
// dependen de auth.uid() vean al usuario real.
export function getSupabaseForUser(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}
