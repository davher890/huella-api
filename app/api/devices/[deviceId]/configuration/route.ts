import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getDeviceConfig, setDeviceConfig } from "@/lib/deviceConfigCache"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const config = await getDeviceConfig(deviceId)
  return NextResponse.json({ sleep_interval: config?.sleepInterval ?? null })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { sleep_interval } = (await req.json()) as { sleep_interval?: number }
  if (typeof sleep_interval !== "number" || !Number.isInteger(sleep_interval) || sleep_interval <= 0) {
    return NextResponse.json(
      { error: "sleep_interval must be a positive integer" },
      { status: 400 }
    )
  }

  const { data: device, error: deviceError } = await supabaseAdmin
    .from("devices")
    .select("id")
    .eq("device_id", deviceId)
    .single()

  if (deviceError || !device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 })
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("device_configuration")
    .select("id")
    .eq("device_id", device.id)
    .maybeSingle()

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 })
  }

  const writeError = existing
    ? (await supabaseAdmin
        .from("device_configuration")
        .update({ sleep_interval })
        .eq("id", existing.id)
      ).error
    : (await supabaseAdmin
        .from("device_configuration")
        .insert({ device_id: device.id, sleep_interval })
      ).error

  if (writeError) {
    return NextResponse.json({ error: writeError.message }, { status: 500 })
  }

  // Update the in-memory cache right away, so the tracker's next request
  // already gets the new value without waiting for a reload.
  setDeviceConfig(deviceId, { sleepInterval: sleep_interval })

  return NextResponse.json({ sleep_interval })
}
