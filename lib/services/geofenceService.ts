import { supabaseAdmin } from "@/lib/supabaseAdminClient"
import type { Geofence, Point } from "@/lib/models/geofence"
import type { ServiceResult } from "./types"

// PostGIS returns `geometry` columns cast to text as hex-encoded EWKB
// (not WKT), so we have to decode the binary by hand.
function parseEwkbPolygonPoints(hex: string): Point[] {
  const buf = Buffer.from(hex, "hex")
  let offset = 0

  const littleEndian = buf.readUInt8(offset) === 1
  offset += 1

  const readUInt32 = () => {
    const value = littleEndian ? buf.readUInt32LE(offset) : buf.readUInt32BE(offset)
    offset += 4
    return value
  }
  const readDouble = () => {
    const value = littleEndian ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset)
    offset += 8
    return value
  }

  const typeAndFlags = readUInt32()
  const hasSrid = (typeAndFlags & 0x20000000) !== 0
  const geomType = typeAndFlags & 0xff
  if (hasSrid) {
    readUInt32() // SRID, we don't need it here
  }

  if (geomType !== 3 /* wkbPolygon */) {
    return []
  }

  const numRings = readUInt32()
  if (numRings === 0) return []

  // We only use the outer ring; holes aren't supported.
  const numPoints = readUInt32()
  const points: Point[] = []
  for (let i = 0; i < numPoints; i++) {
    const lng = readDouble()
    const lat = readDouble()
    points.push({ lat, lng })
  }

  const first = points[0]
  const last = points[points.length - 1]
  if (points.length > 1 && first.lat === last.lat && first.lng === last.lng) {
    points.pop()
  }
  return points
}

export async function getGeofence(deviceDbId: number): Promise<ServiceResult<Geofence | null>> {
  const { data: geofence, error } = await supabaseAdmin
    .from("device_geofences")
    .select("id, device_id, name, created_at, area::text")
    .eq("device_id", deviceDbId)
    .maybeSingle()

  if (error) {
    return { error: error.message, status: 500 }
  }
  if (!geofence) {
    return { data: null }
  }

  return {
    data: {
      id: geofence.id,
      deviceId: geofence.device_id,
      name: geofence.name,
      points: parseEwkbPolygonPoints(geofence.area as unknown as string),
    },
  }
}

export async function saveGeofence(params: {
  deviceDbId: number
  points: Point[]
}): Promise<ServiceResult<{ id: number; device_id: number; name: string | null; created_at: string }>> {
  const ring = params.points.map((p) => `${p.lng} ${p.lat}`)
  if (ring[0] !== ring[ring.length - 1]) {
    ring.push(ring[0])
  }
  const wkt = `SRID=4326;POLYGON((${ring.join(", ")}))`

  // One active zone per device: replace any previous geofence.
  await supabaseAdmin.from("device_geofences").delete().eq("device_id", params.deviceDbId)

  const { data: geofence, error } = await supabaseAdmin
    .from("device_geofences")
    .insert({ device_id: params.deviceDbId, area: wkt })
    .select("id, device_id, name, created_at")
    .single()

  if (error) {
    return { error: error.message, status: 500 }
  }

  return { data: geofence }
}
