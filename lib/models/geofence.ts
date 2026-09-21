export type Point = { lat: number; lng: number }

export type Geofence = {
  id: number
  deviceId: number
  name: string | null
  points: Point[]
}
