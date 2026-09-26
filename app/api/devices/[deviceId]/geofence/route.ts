import { NextResponse } from "next/server"
import { requireDeviceOwner } from "@/lib/auth"
import type { GeofenceGeometryType, Point } from "@/lib/models/geofence"
import { getGeofence, saveGeofence } from "@/lib/services/geofenceService"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const result = await getGeofence(owned.device.id)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ geofence: result.data })
}

export async function POST(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const { points, geometryType } = (await req.json()) as {
    points?: Point[]
    geometryType?: GeofenceGeometryType
  }
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
  if (geometryType !== undefined && geometryType !== "polygon" && geometryType !== "circle") {
    return NextResponse.json(
      { error: "geometryType must be 'polygon' or 'circle'" },
      { status: 400 }
    )
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const result = await saveGeofence({
    deviceDbId: owned.device.id,
    points,
    geometryType: geometryType ?? "polygon",
  })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ geofence: result.data }, { status: 201 })
}
