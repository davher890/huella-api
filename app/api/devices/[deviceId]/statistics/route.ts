import { NextResponse } from "next/server"
import { requireDeviceOwner } from "@/lib/auth"
import { getDeviceStatistics } from "@/lib/services/locationService"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (from && isNaN(Date.parse(from))) {
    return NextResponse.json({ error: "from must be a valid ISO date" }, { status: 400 })
  }
  if (to && isNaN(Date.parse(to))) {
    return NextResponse.json({ error: "to must be a valid ISO date" }, { status: 400 })
  }

  const result = await getDeviceStatistics({ deviceId, from, to })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data)
}
