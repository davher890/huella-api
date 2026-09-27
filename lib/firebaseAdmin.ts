import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"

// Server-side only: never import this from code that could end up in the
// client bundle. Guarded with getApps() because Next.js dev's hot-reload can
// re-run this module without restarting the process, and initializeApp()
// throws if called twice.
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      // Vercel's env var UI can turn literal newlines into the escaped
      // "\n" sequence; turn them back into real newlines either way.
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  })
}

export const firebaseMessaging = getMessaging()
