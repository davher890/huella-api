export type Point = { lat: number; lng: number }

export type GeofenceGeometryType = "polygon" | "circle"

export type Geofence = {
  id: number
  deviceId: number
  name: string | null
  points: Point[]
  geometryType: GeofenceGeometryType
}
