import { NextResponse } from "next/server"
import { requireDeviceOwner } from "@/lib/auth"
import type { ClusterUpdate } from "@/lib/models/location"
import { getLocations, updateLocationClusters } from "@/lib/services/locationService"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const limitParam = searchParams.get("limit")

  if (from && isNaN(Date.parse(from))) {
    return NextResponse.json({ error: "from must be a valid ISO date" }, { status: 400 })
  }
  if (to && isNaN(Date.parse(to))) {
    return NextResponse.json({ error: "to must be a valid ISO date" }, { status: 400 })
  }
  let limit: number | undefined
  if (limitParam) {
    limit = Number(limitParam)
    if (!Number.isInteger(limit) || limit < 1) {
      return NextResponse.json({ error: "limit must be a positive integer" }, { status: 400 })
    }
  }

  const result = await getLocations({ deviceId, from, to, limit })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({ locations: result.data })
}

// Updates the cluster of several of a device's locations in a single call
// (built for the data analysis notebook that computes clusters with DBSCAN
// and then needs to save them).
export async function PATCH(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  const owned = await requireDeviceOwner(req, deviceId)
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status })
  }

  const { updates } = (await req.json()) as { updates?: ClusterUpdate[] }
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json(
      { error: "updates must be a non-empty array of { id, cluster }" },
      { status: 400 }
    )
  }
  for (const u of updates) {
    if (typeof u?.id !== "number" || (u.cluster !== null && typeof u.cluster !== "number")) {
      return NextResponse.json(
        { error: "Each update requires a numeric id and a numeric or null cluster" },
        { status: 400 }
      )
    }
  }

  const result = await updateLocationClusters({ deviceId, updates })
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data)
}
