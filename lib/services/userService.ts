import type { User } from "@supabase/supabase-js"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import type { AdminUserSummary, ProfileUpdate } from "@/lib/models/user"
import type { ServiceResult } from "./types"

// Updates the caller's own profile. Email is intentionally not editable
// here (Supabase treats email changes as a re-verification flow, out of
// scope for this simple profile screen).
export async function updateProfile(
  user: User,
  updates: ProfileUpdate
): Promise<ServiceResult<{ user: User | null }>> {
  if (updates.name === undefined && updates.password === undefined) {
    return { error: "Provide at least one of: name, password", status: 400 }
  }
  if (updates.password !== undefined && updates.password.length < 6) {
    return { error: "password must be at least 6 characters long", status: 400 }
  }

  const payload: { password?: string; user_metadata?: Record<string, unknown> } = {}
  if (updates.password !== undefined) {
    payload.password = updates.password
  }
  if (updates.name !== undefined) {
    payload.user_metadata = { ...user.user_metadata, name: updates.name }
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, payload)
  if (error) {
    return { error: error.message, status: 500 }
  }
  return { data: { user: data.user } }
}

export async function listAllUsers(): Promise<ServiceResult<AdminUserSummary[]>> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) {
    return { error: error.message, status: 500 }
  }

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    role: (u.app_metadata?.role as string | undefined) ?? "user",
    createdAt: u.created_at,
  }))

  return { data: users }
}
