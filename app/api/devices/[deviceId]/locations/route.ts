import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request, { params }: { params: Promise<{ deviceId: string }> }) {

  const { deviceId } = await params
  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const limitParam = searchParams.get('limit')

  if (from && isNaN(Date.parse(from))) {
    return NextResponse.json({ error: 'from must be a valid ISO date' }, { status: 400 })
  }
  if (to && isNaN(Date.parse(to))) {
    return NextResponse.json({ error: 'to must be a valid ISO date' }, { status: 400 })
  }
  let limit: number | undefined
  if (limitParam) {
    limit = Number(limitParam)
    if (!Number.isInteger(limit) || limit < 1) {
      return NextResponse.json({ error: 'limit must be a positive integer' }, { status: 400 })
    }
  }

  let query = supabase.from("device_locations").select('*')
    .eq('device_id', deviceId)

  if (from) {
    query = query.gte('recorded_at', from)
  }
  if (to) {
    query = query.lte('recorded_at', to)
  }

  let orderedQuery = query.order('recorded_at', { ascending: false })
  if (limit) {
    orderedQuery = orderedQuery.limit(limit)
  }

  const { data: locations, error } = await orderedQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ locations: locations ?? [] })
}
