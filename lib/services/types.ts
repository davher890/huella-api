// Shared result shape for every service function: either the data the
// caller asked for, or an error plus the HTTP status the controller should
// respond with. Controllers just do `if ("error" in result) ...` and never
// need to know which Supabase call produced the error.
export type ServiceResult<T> = { data: T } | { error: string; status: number }
