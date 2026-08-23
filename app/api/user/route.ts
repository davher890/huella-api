import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data.user }, { status: 201 })
}

// Updates the logged-in user's own profile. Email is intentionally not
// editable here (Supabase treats email changes as a re-verification flow,
// out of scope for this simple profile screen).
export async function PATCH(req: Request) {
  const auth = await requireUser(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { name, password } = (await req.json()) as { name?: string; password?: string }

  if (name === undefined && password === undefined) {
    return NextResponse.json(
      { error: "Provide at least one of: name, password" },
      { status: 400 }
    )
  }
  if (password !== undefined && password.length < 6) {
    return NextResponse.json(
      { error: "password must be at least 6 characters long" },
      { status: 400 }
    )
  }

  const updates: { password?: string; user_metadata?: Record<string, unknown> } = {}
  if (password !== undefined) {
    updates.password = password
  }
  if (name !== undefined) {
    updates.user_metadata = { ...auth.user.user_metadata, name }
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(auth.user.id, updates)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: data.user })
}
