import { getSupabaseForUser } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import type { AdminDeviceSummary, DeviceSummary } from "@/lib/models/device"
import type { ServiceResult } from "./types"

// Lists the devices owned by a specific user, respecting RLS: runs as that
// user (not the shared anon/admin client) so Postgres policies relying on
// auth.uid() see the real caller.
export async function listDevicesForUser(
  token: string,
  userId: string
): Promise<ServiceResult<DeviceSummary[]>> {
  const supabaseAsUser = getSupabaseForUser(token)

  const { data, error } = await supabaseAsUser
    .from("devices")
    .select("device_id, name, user_devices!inner ( id )")
    .eq("user_devices.user_id", userId)

  if (error) {
    return { error: error.message, status: 500 }
  }

  return { data: (data ?? []).map((d) => ({ id: d.device_id, name: d.name })) }
}

export async function listAllDevices(): Promise<ServiceResult<AdminDeviceSummary[]>> {
  const { data, error } = await supabaseAdmin
    .from("devices")
    .select("id, device_id, name")
    .order("name", { ascending: true })

  if (error) {
    return { error: error.message, status: 500 }
  }
  return { data: data ?? [] }
}

export async function createDevice(input: {
  deviceId: string
  name: string
}): Promise<ServiceResult<AdminDeviceSummary>> {
  const { data, error } = await supabaseAdmin
    .from("devices")
    .insert({ device_id: input.deviceId, name: input.name })
    .select("id, device_id, name")
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "A device with this device_id already exists", status: 409 }
    }
    return { error: error.message, status: 500 }
  }

  return { data }
}

export async function assignDeviceToUser(input: {
  userId: string
  deviceId: number
}): Promise<ServiceResult<Record<string, unknown>>> {
  const { data, error } = await supabaseAdmin
    .from("user_devices")
    .upsert(
      { user_id: input.userId, device_id: input.deviceId },
      { onConflict: "user_id,device_id" }
    )
    .select()
    .single()

  if (error) {
    return { error: error.message, status: 500 }
  }
  return { data }
}

// Same as listAllDevices, but scoped to one user (admin view of "what does
// this user have").
export async function listDevicesForUserId(userId: string): Promise<ServiceResult<AdminDeviceSummary[]>> {
  const { data, error } = await supabaseAdmin
    .from("devices")
    .select("id, device_id, name, user_devices!inner ( id )")
    .eq("user_devices.user_id", userId)

  if (error) {
    return { error: error.message, status: 500 }
  }

  return {
    data: (data ?? []).map((d) => ({ id: d.id, device_id: d.device_id, name: d.name })),
  }
}

// Resolves a device's internal (int) id from its text device_id. Used by
// services that write to tables keyed on the internal id (configuration,
// geofences) but only know the text id from the URL.
export async function findDeviceDbId(deviceId: string): Promise<{ id: number } | null> {
  const { data, error } = await supabaseAdmin
    .from("devices")
    .select("id")
    .eq("device_id", deviceId)
    .single()

  if (error || !data) return null
  return data
}
