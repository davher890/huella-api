import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const device_id = searchParams.get("device_id")

  if (!device_id) {
    return NextResponse.json({ error: "device_id is required" }, { status: 400 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { device_id, latitude, longitude, recorded_at, speed, altitude, accuracy } = body

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
    recorded_at: recorded_at ?? new Date().toISOString(),
    speed,
    altitude,
    accuracy
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
