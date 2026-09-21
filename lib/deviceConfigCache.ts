import type { DeviceConfig } from "./models/deviceConfig"
import { supabaseAdmin } from "./supabaseAdminClient"

export type { DeviceConfig }

// In-memory cache of each device's configuration, indexed by the text
// device_id (the same one used by /api/tht and /api/devices/*).
//
// Note: on Vercel, each serverless function instance can have its own copy
// of this cache (there's no single persistent "server process" like in a
// traditional server), and a cold instance reloads it from scratch. That's
// why loading is lazy (on first use, not "on startup") and self-healing: if
// the cache is empty, it reloads itself from the database instead of
// failing.
const cache = new Map<string, DeviceConfig>()
let loaded = false
let loadingPromise: Promise<void> | null = null

type DeviceConfigurationRow = {
  sleep_interval: number
  devices: { device_id: string } | { device_id: string }[] | null
}

async function loadCache(): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("device_configuration")
    .select("sleep_interval, devices ( device_id )")

  if (error) {
    throw error
  }

  for (const row of (data ?? []) as DeviceConfigurationRow[]) {
    const devices = Array.isArray(row.devices) ? row.devices[0] : row.devices
    if (devices?.device_id) {
      cache.set(devices.device_id, { sleepInterval: row.sleep_interval })
    }
  }

  loaded = true
}

async function ensureLoaded(): Promise<void> {
  if (loaded) return
  if (!loadingPromise) {
    loadingPromise = loadCache().catch((err) => {
      // If loading fails, it will be retried on the next call.
      loadingPromise = null
      throw err
    })
  }
  await loadingPromise
}

export async function getDeviceConfig(deviceId: string): Promise<DeviceConfig | null> {
  await ensureLoaded()
  return cache.get(deviceId) ?? null
}

export function setDeviceConfig(deviceId: string, config: DeviceConfig): void {
  cache.set(deviceId, config)
}
