import { NextResponse } from "next/server"
import { getSupabaseForUser, requireUser } from "@/lib/auth"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Query as the authenticated user (not the shared anon client) so that
  // Postgres RLS policies relying on auth.uid() see the real caller.
  const supabaseAsUser = getSupabaseForUser(auth.token)

  const { data: devices, error } = await supabaseAsUser
    .from("devices")
    .select("device_id, name, user_devices!inner ( id )")
    .eq("user_devices.user_id", auth.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    devices: (devices ?? []).map((d) => ({ id: d.device_id, name: d.name })),
  })
}
