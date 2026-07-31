import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.app_metadata?.role ?? "user",
    createdAt: u.created_at,
  }))

  return NextResponse.json({ users })
}
