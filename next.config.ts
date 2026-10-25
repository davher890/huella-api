import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Flutter web build for the_horse_tracker_app lives (as static files)
  // under public/app/, built with `flutter build web --base-href /app/`.
  // Next.js serves public/app/index.html at /app/index.html automatically,
  // but not at the bare /app path, hence this rewrite.
  async rewrites() {
    return [
      {
        source: "/app",
        destination: "/app/index.html",
      },
    ];
  },
};

export default nextConfig;
