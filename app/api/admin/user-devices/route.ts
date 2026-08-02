import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { userId, deviceId } = await req.json()
  if (!userId || !deviceId) {
    return NextResponse.json(
      { error: "userId and deviceId are required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from("user_devices")
    .upsert({ user_id: userId, device_id: deviceId }, { onConflict: 'user_id,device_id' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ userDevice: data }, { status: 201 })
}
