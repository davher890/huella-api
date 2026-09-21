import { getDeviceConfig as getCachedConfig, setDeviceConfig } from "@/lib/deviceConfigCache"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import { findDeviceDbId } from "./deviceService"
import type { ServiceResult } from "./types"

export async function getConfig(deviceId: string): Promise<{ sleepInterval: number | null }> {
  const config = await getCachedConfig(deviceId)
  return { sleepInterval: config?.sleepInterval ?? null }
}

export async function updateConfig(params: {
  deviceId: string
  sleepInterval: number
}): Promise<ServiceResult<{ sleepInterval: number }>> {
  const device = await findDeviceDbId(params.deviceId)
  if (!device) {
    return { error: "Device not found", status: 404 }
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("device_configuration")
    .select("id")
    .eq("device_id", device.id)
    .maybeSingle()

  if (existingError) {
    return { error: existingError.message, status: 500 }
  }

  const writeError = existing
    ? (
        await supabaseAdmin
          .from("device_configuration")
          .update({ sleep_interval: params.sleepInterval })
          .eq("id", existing.id)
      ).error
    : (
        await supabaseAdmin
          .from("device_configuration")
          .insert({ device_id: device.id, sleep_interval: params.sleepInterval })
      ).error

  if (writeError) {
    return { error: writeError.message, status: 500 }
  }

  // Update the in-memory cache right away, so the tracker's next request
  // already gets the new value without waiting for a reload.
  setDeviceConfig(params.deviceId, { sleepInterval: params.sleepInterval })

  return { data: { sleepInterval: params.sleepInterval } }
}
