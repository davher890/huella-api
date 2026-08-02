import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

type LocationInput = {
  device_id: string
  latitude: number
  longitude: number
  recorded_at?: string
  speed?: number
  altitude?: number
  accuracy?: number
}

export async function POST(req: Request) {
  const { locations } = (await req.json()) as { locations?: LocationInput[] }

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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: rows.length }, { status: 201 })
}
