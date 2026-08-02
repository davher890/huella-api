import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const { data: devices, error } = await supabaseAdmin
    .from("devices")
    .select("id, device_id, name, user_devices!inner ( id )")
    .eq("user_devices.user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    devices: (devices ?? []).map((d) => ({ id: d.id, device_id: d.device_id, name: d.name })),
  })
}
