import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// The Flutter web build is served from this same deployment (under /app),
// reachable both via the custom domain (huellagps.es) and via Vercel's own
// *.vercel.app domains (the production alias, plus a unique preview URL per
// deployment) — the browser treats each of these as a different origin.
// Auth here is a Bearer token (not cookies), so allowing all of them is a
// reasonable tradeoff rather than hardcoding one exact domain.
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false
  try {
    const hostname = new URL(origin).hostname
    return (
      hostname.endsWith(".vercel.app") ||
      hostname === "huellagps.es" ||
      hostname.endsWith(".huellagps.es")
    )
  } catch {
    return false
  }
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? ""
  const allowed = isAllowedOrigin(origin)

  if (request.method === "OPTIONS") {
    return NextResponse.json(
      {},
      {
        headers: {
          ...(allowed && { "Access-Control-Allow-Origin": origin }),
          ...corsOptions,
        },
      }
    )
  }

  const response = NextResponse.next()
  if (allowed) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }
  for (const [key, value] of Object.entries(corsOptions)) {
    response.headers.set(key, value)
  }
  return response
}

export const config = {
  matcher: "/api/:path*",
}
