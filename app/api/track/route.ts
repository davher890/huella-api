import { NextResponse } from "next/server"
import { recordLocation } from "@/lib/services/locationService"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  console.log("Received GET request with params:", searchParams.toString())

  const device_id = searchParams.get("device_id")
  const latitude = parseFloat(searchParams.get("lat") ?? "")
  const longitude = parseFloat(searchParams.get("lon") ?? "")
  const recorded_at = parseFloat(searchParams.get("deviceTime") ?? "")
    ? new Date(parseFloat(searchParams.get("deviceTime")!)).toISOString()
    : null
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
    accuracy,
  })

  if (!device_id || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "device_id, latitude and longitude are required" },
      { status: 400 }
    )
  }

  const result = await recordLocation({
    deviceId: device_id,
    latitude,
    longitude,
    recordedAt: recorded_at,
    speed,
    altitude,
    accuracy,
  })

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(
    { success: true },
    { status: 201 }
  )
}
