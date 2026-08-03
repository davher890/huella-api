import type { User } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"
import { supabaseAdmin } from "./supabaseAdminClient"

export type AuthResult =
  | { user: User; token: string }
  | { error: string; status: number }

// Single place where a request's Authorization: Bearer <token> is
// validated. Any route that needs to know "who is making this call"
// should use this function instead of repeating the token
// extraction/verification.
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

// Same as requireUser, but also requires the user to have the admin role.
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

export type DeviceOwnerResult =
  | { user: User; device: { id: number } }
  | { error: string; status: number }

// Same as requireUser, but also checks that the device (identified by its
// text device_id) belongs to the authenticated user.
export async function requireDeviceOwner(req: Request, deviceId: string): Promise<DeviceOwnerResult> {
  const auth = await requireUser(req)
  if ("error" in auth) {
    return auth
  }

  const { data: device, error } = await supabaseAdmin
    .from("devices")
    .select("id, user_devices!inner ( id )")
    .eq("device_id", deviceId)
    .eq("user_devices.user_id", auth.user.id)
    .single()

  if (error || !device) {
    return { error: "Device not found or not owned by this user", status: 404 }
  }

  return { user: auth.user, device }
}

// Supabase client that runs queries as the authenticated user (not as the
// shared anon client), so RLS policies relying on auth.uid() see the real
// caller.
export function getSupabaseForUser(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}
