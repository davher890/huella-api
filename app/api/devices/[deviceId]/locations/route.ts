import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {

  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
  }

  const { data: locations, error } = await supabase.from("device_locations").select('*')
    .eq('device_id', deviceId)
    .order('recorded_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ locations: locations ?? [] })
}
