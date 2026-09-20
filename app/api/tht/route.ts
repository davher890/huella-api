import { NextResponse } from "next/server"
import { getDeviceConfig } from "@/lib/deviceConfigCache"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  console.log("Received GET request with params:", searchParams.toString())
  console.log("Received GET request with params:", Object.fromEntries(searchParams))
  const device_id = searchParams.get("device_id")

  if (!device_id) {
    return NextResponse.json({ error: "device_id is required" }, { status: 400 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log("Received POST request with body:", body)
  const { device_id, latitude, longitude, recorded_at, speed, altitude, accuracy, battery_mv, battery_pct, source } = body

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
    accuracy,
    battery_mv,
    battery_pct,
    source
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
