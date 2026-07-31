import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"

type RequireAdminResult =
  | { user: User }
  | { error: string; status: number }

export async function requireAdmin(req: Request): Promise<RequireAdminResult> {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (!token) {
    return { error: "Missing Authorization header", status: 401 }
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    return { error: "Invalid or expired token", status: 401 }
  }

  if (data.user.app_metadata?.role !== "admin") {
    return { error: "Forbidden: admin only", status: 403 }
  }

  return { user: data.user }
}
