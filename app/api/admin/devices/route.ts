import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createDevice, listAllDevices } from "@/lib/services/deviceService"

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await listAllDevices()
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ devices: result.data })
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

  const result = await createDevice({ deviceId: device_id, name })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ device: result.data }, { status: 201 })
}
