import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getConfig, updateConfig } from "@/lib/services/deviceConfigService"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { sleepInterval } = await getConfig(deviceId)
  return NextResponse.json({ sleep_interval: sleepInterval })
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

  const result = await updateConfig({ deviceId, sleepInterval: sleep_interval })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ sleep_interval: result.data.sleepInterval })
}
