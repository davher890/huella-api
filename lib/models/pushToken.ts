export type PushTokenPlatform = "android" | "ios"

export type PushToken = {
  id: number
  userId: string
  fcmToken: string
  platform: PushTokenPlatform
}
