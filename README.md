This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Flutter web app at /app

`public/app/` holds a static build of the viewer app from the
`the_horse_tracker_app` repo (a separate Flutter project), served at `/app`
(e.g. `https://huellagps.es/app`). It's built there and copied in — see that
repo's README ("Deploying the web build") for the exact steps. It isn't
generated or kept in sync automatically by anything in this repo, so after
copying in a new build, commit and push it here like any other change for it
to go live.

The `rewrites()` in `next.config.ts` maps the bare `/app` path to
`public/app/index.html` (Next.js serves everything else under `public/app/`
directly, by its own path). `proxy.ts` adds the CORS headers this web build
needs when calling the `/api/*` routes from the browser (native/mobile HTTP
clients aren't subject to CORS, so this was never needed before).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
