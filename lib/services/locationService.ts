import { calculateTotalDistance } from "@/app/utils/utils"
import { getDeviceConfig } from "@/lib/deviceConfigCache"
import { supabase } from "@/lib/supabaseClient"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import type {
  BatchLocationInput,
  ClusterUpdate,
  LocationRow,
  RecordLocationInput,
} from "@/lib/models/location"
import type { ServiceResult } from "./types"

// Supabase (PostgREST) caps every response at "Max Rows" (1000 by default)
// no matter what the query's .range()/.limit() asks for. To fetch more than
// that we have to request it in successive pages, each below that cap.
const PAGE_SIZE = 1000
const MAX_PAGES = 50 // safety net: up to 50,000 rows per response

function buildBaseQuery(deviceId: string, from: string | null, to: string | null) {
  let query = supabase.from("device_locations").select("*").eq("device_id", deviceId)

  if (from) query = query.gte("recorded_at", from)
  if (to) query = query.lte("recorded_at", to)

  // Secondary sort key (id) so pagination is deterministic even when
  // several rows share the same recorded_at.
  return query.order("recorded_at", { ascending: false }).order("id", { ascending: false })
}

export async function getLocations(params: {
  deviceId: string
  from: string | null
  to: string | null
  limit?: number
}): Promise<ServiceResult<LocationRow[]>> {
  const { deviceId, from, to, limit } = params

  // With an explicit limit (e.g. "latest position") a single call is enough.
  if (limit) {
    const { data, error } = await buildBaseQuery(deviceId, from, to).limit(limit)
    if (error) return { error: error.message, status: 500 }
    return { data: data ?? [] }
  }

  // Without a limit: fetch everything, paginating under Supabase's cap.
  const locations: LocationRow[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const rangeStart = page * PAGE_SIZE
    const rangeEnd = rangeStart + PAGE_SIZE - 1
    const { data, error } = await buildBaseQuery(deviceId, from, to).range(rangeStart, rangeEnd)
    if (error) return { error: error.message, status: 500 }

    locations.push(...(data ?? []))
    if (!data || data.length < PAGE_SIZE) break
  }

  return { data: locations }
}

// Updates the cluster of several of a device's locations in a single call
// (built for the data analysis notebook that computes clusters with DBSCAN
// and then needs to save them).
export async function updateLocationClusters(params: {
  deviceId: string
  updates: ClusterUpdate[]
}): Promise<ServiceResult<{ updated: { id: number; cluster: number | null }[]; notFound: number[] }>> {
  // A single SQL statement for all rows (via RPC), instead of one HTTP
  // request per update: with hundreds/thousands of locations, firing a
  // Promise.all of individual updates saturates the outgoing connections.
  const { data, error } = await supabaseAdmin.rpc("update_device_location_clusters", {
    p_device_id: params.deviceId,
    p_updates: params.updates,
  })

  if (error) {
    return { error: error.message, status: 500 }
  }

  const updated = (data ?? []) as { id: number; cluster: number | null }[]
  const updatedIds = new Set(updated.map((row) => row.id))
  const notFound = params.updates.map((u) => u.id).filter((id) => !updatedIds.has(id))

  return { data: { updated, notFound } }
}

// Single-location ingestion (used by the GET-based firmware wire format).
export async function recordLocation(
  input: RecordLocationInput
): Promise<ServiceResult<{ sleepInterval: number | null }>> {
  const { error } = await supabase.from("device_locations").insert({
    device_id: input.deviceId,
    latitude: input.latitude,
    longitude: input.longitude,
    altitude: input.altitude,
    recorded_at: input.recordedAt ?? new Date().toISOString(),
    speed: input.speed,
    accuracy: input.accuracy,
    battery_mv: 0,
    battery_pct: 0,
    source: 0,
  })

  if (error) {
    console.error("Error inserting device location:", error)
    return { error: error.message, status: 500 }
  }

  const config = await getDeviceConfig(input.deviceId)
  return { data: { sleepInterval: config?.sleepInterval ?? null } }
}

// Batch ingestion (used by the Android app and the LilyGO TinyGSM firmware,
// which flush their whole offline queue in one call).
export async function recordLocationsBatch(
  locations: BatchLocationInput[]
): Promise<ServiceResult<{ count: number; sleepInterval: number | null }>> {
  const rows = locations.map((loc) => ({
    device_id: loc.device_id,
    latitude: loc.latitude,
    longitude: loc.longitude,
    recorded_at: loc.recorded_at ?? new Date().toISOString(),
    speed: loc.speed,
    altitude: loc.altitude,
    accuracy: loc.accuracy,
  }))

  const { error } = await supabase.from("device_locations").insert(rows)
  if (error) {
    return { error: error.message, status: 500 }
  }

  // In practice the whole batch belongs to the same device (the offline
  // queue is per device); we return the last record's config as current.
  const lastDeviceId = rows[rows.length - 1].device_id
  const config = await getDeviceConfig(lastDeviceId)

  return { data: { count: rows.length, sleepInterval: config?.sleepInterval ?? null } }
}

export async function getDeviceStatistics(params: {
  deviceId: string
  from: string | null
  to: string | null
}): Promise<ServiceResult<{ locations: LocationRow[]; distance: number }>> {
  const result = await getLocations(params)
  if ("error" in result) return result

  const distance = calculateTotalDistance(
    result.data as unknown as { latitude: number; longitude: number }[]
  )

  return { data: { locations: result.data, distance } }
}
