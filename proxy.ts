import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// The Flutter web build is served from this same deployment (under /app),
// but Vercel also exposes every deployment at its own unique *.vercel.app
// preview URL, which the browser treats as a different origin from
// whichever one happens to be "production" at the time. Auth here is a
// Bearer token (not cookies), so allowing any *.vercel.app origin is a
// reasonable tradeoff rather than hardcoding one exact domain.
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false
  try {
    return new URL(origin).hostname.endsWith(".vercel.app")
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
