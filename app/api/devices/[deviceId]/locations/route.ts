import { NextResponse } from "next/server"
import { requireDeviceOwner } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"
import { supabaseAdmin } from "@/lib/supabaseAdminClient"

type ClusterUpdate = { id: number; cluster: number | null }

// Supabase (PostgREST) capa cada respuesta a "Max Rows" (1000 por defecto)
// pase lo que pase en el .range()/.limit() de la query. Para traer mas de
// eso hay que pedirlo en paginas sucesivas, todas por debajo de ese tope.
const PAGE_SIZE = 1000
const MAX_PAGES = 50 // salvaguarda: hasta 50.000 filas por respuesta

function buildBaseQuery(deviceId: string, from: string | null, to: string | null) {
  let query = supabase.from("device_locations").select('*')
    .eq('device_id', deviceId)

  if (from) {
    query = query.gte('recorded_at', from)
  }
  if (to) {
    query = query.lte('recorded_at', to)
  }

  // Segundo criterio de orden (id) para que la paginacion sea determinista
  // aunque haya varias filas con el mismo recorded_at.
  return query.order('recorded_at', { ascending: false }).order('id', { ascending: false })
}

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

  // Con limit explicito (ej. "ultima posicion") basta una sola llamada.
  if (limit) {
    const { data, error } = await buildBaseQuery(deviceId, from, to).limit(limit)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ locations: data ?? [] })
  }

  // Sin limit: traemos todo, paginando por debajo del tope de Supabase.
  const locations: Record<string, unknown>[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const rangeStart = page * PAGE_SIZE
    const rangeEnd = rangeStart + PAGE_SIZE - 1

    const { data, error } = await buildBaseQuery(deviceId, from, to).range(rangeStart, rangeEnd)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    locations.push(...(data ?? []))

    if (!data || data.length < PAGE_SIZE) break
  }

  return NextResponse.json({ locations })
}

// Actualiza el cluster de varias locations de un device en una sola llamada
// (pensado para el notebook de analisis de datos que calcula clusters con
// DBSCAN y luego necesita guardarlos).
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

  // Una sola sentencia SQL para todas las filas (via RPC), en vez de una
  // peticion HTTP por update: con cientos/miles de locations, disparar un
  // Promise.all de updates individuales satura las conexiones salientes.
  const { data, error } = await supabaseAdmin.rpc("update_device_location_clusters", {
    p_device_id: deviceId,
    p_updates: updates,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const updated = (data ?? []) as { id: number; cluster: number | null }[]
  const updatedIds = new Set(updated.map((row) => row.id))
  const notFound = updates.map((u) => u.id).filter((id) => !updatedIds.has(id))

  return NextResponse.json({ updated, notFound })
}
