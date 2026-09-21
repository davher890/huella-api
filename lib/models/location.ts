// A raw device_locations row, as returned by Supabase (select('*')).
export type LocationRow = Record<string, unknown>

export type ClusterUpdate = { id: number; cluster: number | null }

// Single-location ingestion payload (GET-based firmware wire format).
export type RecordLocationInput = {
  deviceId: string
  latitude: number
  longitude: number
  recordedAt: string | null
  speed: number | null
  altitude: number | null
  accuracy: number | null
}

// One entry of a POST /api/tht/batch payload.
export type BatchLocationInput = {
  device_id: string
  latitude: number
  longitude: number
  recorded_at?: string
  speed?: number
  altitude?: number
  accuracy?: number
}
