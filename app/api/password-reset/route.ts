import { NextResponse } from "next/server"
import { requestPasswordReset } from "@/lib/services/authService"

// Public on purpose: this is the "forgot my password, can't log in" flow,
// so it can't require a Bearer token. Always responds with success
// regardless of whether the email exists, so this can't be used to check
// which emails are registered.
export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string }

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }

  await requestPasswordReset(email)

  return NextResponse.json({ success: true })
}
