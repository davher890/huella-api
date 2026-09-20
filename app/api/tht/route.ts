import { NextResponse } from "next/server"
import { getDeviceConfig } from "@/lib/deviceConfigCache"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  console.log("Received GET request with params:", searchParams.toString())

  const device_id = searchParams.get("device_id")
  const latitude = parseFloat(searchParams.get("lat") ?? "")
  const longitude = parseFloat(searchParams.get("lon") ?? "")
  const recorded_at = parseFloat(searchParams.get("time") ?? "") ? new Date(parseFloat(searchParams.get("time")!)).toISOString() : null
  const speed = searchParams.get("speed") ? parseFloat(searchParams.get("speed")!) : null
  const altitude = searchParams.get("altitude") ? parseFloat(searchParams.get("altitude")!) : null
  const accuracy = searchParams.get("accuracy") ? parseFloat(searchParams.get("accuracy")!) : null

  console.log("Parsed parameters:", {
    device_id,
    latitude,
    longitude,
    recorded_at,
    speed,
    altitude,
    accuracy
  })

  if (!device_id || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "device_id, latitude and longitude are required" },
      { status: 400 }
    )
  }

  const { error } = await supabase.from("device_locations").insert({
    device_id,
    latitude,
    longitude,
    altitude,
    recorded_at: recorded_at ?? new Date().toISOString(),
    speed,
    accuracy,
    battery_mv: 0,
    battery_pct: 0,
    source: 0
  })

  if (error) {
    console.error("Error inserting device location:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const config = await getDeviceConfig(device_id)

  return NextResponse.json(
    { success: true, sleep_interval: config?.sleepInterval ?? null },
    { status: 201 }
  )
}