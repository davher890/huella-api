import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import type { ServiceResult } from "./types"

export async function login(
  email: string,
  password: string
): Promise<ServiceResult<{ user: User | null; session: Session | null }>> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message, status: 401 }
  }
  return { data: { user: data.user, session: data.session } }
}

export async function signUp(
  email: string,
  password: string
): Promise<ServiceResult<{ user: User | null }>> {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message, status: 400 }
  }
  return { data: { user: data.user } }
}

// Always resolves regardless of whether the email exists: this is the
// "forgot my password" flow, and Supabase itself never reveals whether an
// account exists, so neither should we.
export async function requestPasswordReset(email: string): Promise<void> {
  await supabase.auth.resetPasswordForEmail(email)
}
