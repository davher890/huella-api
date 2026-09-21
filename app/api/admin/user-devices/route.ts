import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { assignDeviceToUser } from "@/lib/services/deviceService"

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

  const result = await assignDeviceToUser({ userId, deviceId })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ userDevice: result.data }, { status: 201 })
}
