import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }

  // Query as the authenticated user (not the shared anon client) so that
  // Postgres RLS policies relying on auth.uid() see the real caller.
  const supabaseAsUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: devices, error } = await supabaseAsUser
    .from("devices")
    .select("device_id, name, user_devices!inner ( id )")
    .eq("user_devices.user_id", userData.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    devices: (devices ?? []).map((d) => ({ id: d.device_id, name: d.name })),
  })
}
