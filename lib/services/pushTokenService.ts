import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import type { PushTokenPlatform } from "@/lib/models/pushToken"
import type { ServiceResult } from "./types"

// One row per physical app install (unique on fcm_token, not user_id): if a
// different user logs into the same device, re-registering reassigns the
// token to them instead of creating a duplicate row that would still
// notify the previous user.
export async function savePushToken(params: {
  userId: string
  fcmToken: string
  platform: PushTokenPlatform
}): Promise<ServiceResult<{ id: number }>> {
  const { data, error } = await supabaseAdmin
    .from("push_tokens")
    .upsert(
      {
        user_id: params.userId,
        fcm_token: params.fcmToken,
        platform: params.platform,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "fcm_token" }
    )
    .select("id")
    .single()

  if (error) {
    return { error: error.message, status: 500 }
  }
  return { data }
}

// Scoped to the caller's own userId so one user can't remove another's
// token (e.g. called on logout, to stop pushing to a device once the user
// signs out of it).
export async function deletePushToken(params: {
  userId: string
  fcmToken: string
}): Promise<ServiceResult<{ deleted: boolean }>> {
  const { error } = await supabaseAdmin
    .from("push_tokens")
    .delete()
    .eq("user_id", params.userId)
    .eq("fcm_token", params.fcmToken)

  if (error) {
    return { error: error.message, status: 500 }
  }
  return { data: { deleted: true } }
}
