import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { listAllUsers } from "@/lib/services/userService"

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await listAllUsers()
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ users: result.data })
}
