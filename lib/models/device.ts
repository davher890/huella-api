// Device as seen by its owner: only the text device_id is exposed.
export type DeviceSummary = { id: string; name: string }

// Device as seen by an admin: includes the internal (int) id too, needed
// to assign it to a user or attach a geofence/configuration.
export type AdminDeviceSummary = { id: number; device_id: string; name: string }
