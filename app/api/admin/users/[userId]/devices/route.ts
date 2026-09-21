import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { listDevicesForUserId } from "@/lib/services/deviceService"

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const result = await listDevicesForUserId(userId)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ devices: result.data })
}
