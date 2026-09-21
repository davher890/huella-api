import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { signUp } from "@/lib/services/authService"
import { updateProfile } from "@/lib/services/userService"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    )
  }

  const result = await signUp(email, password)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data, { status: 201 })
}

// Updates the logged-in user's own profile. Email is intentionally not
// editable here (Supabase treats email changes as a re-verification flow,
// out of scope for this simple profile screen).
export async function PATCH(req: Request) {
  const auth = await requireUser(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { name, password } = (await req.json()) as { name?: string; password?: string }

  const result = await updateProfile(auth.user, { name, password })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data)
}
