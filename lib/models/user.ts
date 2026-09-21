export type AdminUserSummary = {
  id: string
  email: string | undefined
  role: string
  createdAt: string
}

export type ProfileUpdate = {
  name?: string
  password?: string
}
