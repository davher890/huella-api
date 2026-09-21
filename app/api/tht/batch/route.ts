import { NextResponse } from "next/server"
import type { BatchLocationInput } from "@/lib/models/location"
import { recordLocationsBatch } from "@/lib/services/locationService"

export async function POST(req: Request) {
  const { locations } = (await req.json()) as { locations?: BatchLocationInput[] }

  if (!Array.isArray(locations) || locations.length === 0) {
    return NextResponse.json(
      { error: "locations must be a non-empty array" },
      { status: 400 }
    )
  }

  for (const loc of locations) {
    if (!loc?.device_id || typeof loc.latitude !== "number" || typeof loc.longitude !== "number") {
      return NextResponse.json(
        { error: "Each location requires device_id, latitude and longitude" },
        { status: 400 }
      )
    }
  }

  const result = await recordLocationsBatch(locations)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(
    { success: true, count: result.data.count, sleep_interval: result.data.sleepInterval },
    { status: 201 }
  )
}
