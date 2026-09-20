import { NextResponse } from "next/server"
import { getDeviceConfig } from "@/lib/deviceConfigCache"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  console.log("Received GET request with params:", searchParams.toString())
  // const { device_id, latitude, longitude, recorded_at, speed, altitude, accuracy, battery_mv, battery_pct, source } = body
  const device_id = searchParams.get("device_id")  // <- Traccar manda "id", no "device_id"
  const latitude = searchParams.get("lat")
  const longitude = searchParams.get("lon")
  const recorded_at = searchParams.get("timestamp")
  const speed = searchParams.get("speed")
  const altitude = searchParams.get("altitude")
  // const accuracy = searchParams.get("accuracy")
  // const battery_mv = searchParams.get("battery_mv")
  // const battery_pct = searchParams.get("battery_pct")
  // const source = searchParams.get("source")

  console.log("Parsed parameters:", {
    device_id,
    latitude,
    longitude,
    recorded_at,
    speed,
    altitude
  })
  if (!device_id) {
    return NextResponse.json({ error: "device_id is required" }, { status: 400 })
  }

  if (!device_id || typeof latitude !== "number" || typeof longitude !== "number") {
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
    accuracy: 0,
    battery_mv: 0,
    battery_pct: 0,
    source: 0
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const config = await getDeviceConfig(device_id)

  return NextResponse.json(
    { success: true, sleep_interval: config?.sleepInterval ?? null },
    { status: 201 }
  )
}
