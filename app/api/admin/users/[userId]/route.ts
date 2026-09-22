import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { deleteUser } from "@/lib/services/userService"

export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await requireAdmin(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const result = await deleteUser(userId)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data)
}
