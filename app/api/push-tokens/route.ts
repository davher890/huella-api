import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import type { PushTokenPlatform } from "@/lib/models/pushToken"
import { deletePushToken, savePushToken } from "@/lib/services/pushTokenService"

// Registers (or reassigns) the FCM token for the logged-in user. Called by
// the app on login and whenever Firebase issues a new token.
export async function POST(req: Request) {
  const auth = await requireUser(req)
  if ("error" in auth) {
    console.error("Authentication error:", auth.error)
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { fcmToken, platform } = (await req.json()) as {
    fcmToken?: string
    platform?: PushTokenPlatform
  }

  if (!fcmToken) {
    console.error("Missing fcmToken")
    return NextResponse.json({ error: "fcmToken is required" }, { status: 400 })
  }
  if (platform !== "android" && platform !== "ios") {
    console.error("Invalid platform")
    return NextResponse.json({ error: "platform must be 'android' or 'ios'" }, { status: 400 })
  }

  const result = await savePushToken({ userId: auth.user.id, fcmToken, platform })
  if ("error" in result) {
    console.error("Error saving push token:", result.error)
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data, { status: 201 })
}

// Unregisters a token, e.g. called on logout so the signed-out device stops
// receiving push notifications for this user.
export async function DELETE(req: Request) {
  const auth = await requireUser(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { fcmToken } = (await req.json()) as { fcmToken?: string }
  if (!fcmToken) {
    return NextResponse.json({ error: "fcmToken is required" }, { status: 400 })
  }

  const result = await deletePushToken({ userId: auth.user.id, fcmToken })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data)
}
