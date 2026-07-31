import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { data: devices, error } = await supabaseAdmin
    .from("devices")
    .select("id, device_id, name")
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ devices: devices ?? [] })
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { device_id, name } = await req.json()
  if (!device_id || !name) {
    return NextResponse.json(
      { error: "device_id and name are required" },
      { status: 400 }
    )
  }

  const { data: device, error } = await supabaseAdmin
    .from("devices")
    .insert({ device_id, name })
    .select("id, device_id, name")
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A device with this device_id already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ device }, { status: 201 })
}
