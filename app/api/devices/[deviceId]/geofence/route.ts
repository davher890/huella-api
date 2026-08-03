import { NextResponse } from "next/server"
import { requireDeviceOwner } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

type Point = { lat: number; lng: number }

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

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const { data: geofence, error } = await supabaseAdmin
    .from("device_geofences")
    .select("id, device_id, name, created_at, area::text")
    .eq("device_id", owned.device.id)
    .maybeSingle()

  console.log(geofence, error)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!geofence) {
    return NextResponse.json({ geofence: null })
  }

  return NextResponse.json({
    geofence: {
      id: geofence.id,
      deviceId: geofence.device_id,
      name: geofence.name,
      points: parseEwkbPolygonPoints(geofence.area as unknown as string),
    },
  })
}

export async function POST(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const { points } = (await req.json()) as { points?: Point[] }
  if (!Array.isArray(points) || points.length < 3) {
    return NextResponse.json(
      { error: "points must be an array of at least 3 {lat, lng} objects" },
      { status: 400 }
    )
  }
  for (const p of points) {
    if (typeof p?.lat !== "number" || typeof p?.lng !== "number") {
      return NextResponse.json(
        { error: "Each point requires numeric lat and lng" },
        { status: 400 }
      )
    }
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const ring = points.map((p) => `${p.lng} ${p.lat}`)
  if (ring[0] !== ring[ring.length - 1]) {
    ring.push(ring[0])
  }
  const wkt = `SRID=4326;POLYGON((${ring.join(", ")}))`

  // One active zone per device: replace any previous geofence.
  await supabaseAdmin.from("device_geofences").delete().eq("device_id", owned.device.id)

  const { data: geofence, error } = await supabaseAdmin
    .from("device_geofences")
    .insert({ device_id: owned.device.id, area: wkt })
    .select("id, device_id, name, created_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ geofence }, { status: 201 })
}
