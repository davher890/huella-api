import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { listDevicesForUser } from "@/lib/services/deviceService"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await listDevicesForUser(auth.token, auth.user.id)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ devices: result.data })
}
