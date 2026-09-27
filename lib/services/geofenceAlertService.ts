import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import { firebaseMessaging } from "@/lib/firebaseAdmin"
import type { ServiceResult } from "./types"

// Notifies every owner of a device the moment it's detected leaving its
// geofence (the inside -> outside transition), not on every subsequent ping
// while it stays outside. devices.last_geofence_status is what remembers
// "was it inside last time we checked", so the transition can be detected.
export async function notifyIfLeftGeofence(params: {
  deviceId: string
  isWithinGeofence: boolean
}): Promise<ServiceResult<{ notified: boolean }>> {
  const { data: device, error: deviceError } = await supabaseAdmin
    .from("devices")
    .select("id, name, last_geofence_status")
    .eq("device_id", params.deviceId)
    .maybeSingle()

  if (deviceError) {
    return { error: deviceError.message, status: 500 }
  }
  if (!device) {
    return { data: { notified: false } }
  }

  const wasInside = device.last_geofence_status as boolean | null
  console.log(`Device ${device.id} last_geofence_status: ${wasInside}, current isWithinGeofence: ${params.isWithinGeofence}`)

  // Persisted regardless of whether this call ends up notifying, so the
  // next check always has an accurate "before" state to compare against.
  const { error: updateError } = await supabaseAdmin
    .from("devices")
    .update({ last_geofence_status: params.isWithinGeofence })
    .eq("id", device.id)
  if (updateError) {
    console.error("Error updating last_geofence_status:", updateError.message)
    return { error: updateError.message, status: 500 }
  }

  const justLeft = wasInside === true && params.isWithinGeofence === false
  if (!justLeft) {
    return { data: { notified: false } }
  }

  const { data: owners, error: ownersError } = await supabaseAdmin
    .from("user_devices")
    .select("user_id")
    .eq("device_id", device.id)
  if (ownersError) {
    console.error("Error fetching device owners:", ownersError.message)
    return { error: ownersError.message, status: 500 }
  }

  const userIds = (owners ?? []).map((o) => o.user_id as string)
  if (userIds.length === 0) {
    return { data: { notified: false } }
  }

  const { data: tokenRows, error: tokensError } = await supabaseAdmin
    .from("push_tokens")
    .select("fcm_token")
    .in("user_id", userIds)
  if (tokensError) {
    return { error: tokensError.message, status: 500 }
  }

  const fcmTokens = (tokenRows ?? []).map((t) => t.fcm_token as string)
  if (fcmTokens.length === 0) {
    return { data: { notified: false } }
  }

  await firebaseMessaging.sendEachForMulticast({
    tokens: fcmTokens,
    notification: {
      title: "Salida de zona",
      body: `${device.name ?? params.deviceId} ha salido de su zona segura.`,
    },
  })

  return { data: { notified: true } }
}
