import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// "Big Shoulders Display" isn't in next/font's bundled catalog; "Big
// Shoulders" is the same super-family (condensed industrial display type)
// and is self-hosted the same way.
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-big-shoulders",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Huella GPS — Localización en tiempo real para vehículos, flotas y animales",
  description:
    "Alquila un localizador GPS 4G sin compromiso de compra. Localización en tiempo real, alertas de geovalla, distancia recorrida y gestión de dispositivos desde una sola app. Para taxis, furgonetas de reparto, alquiler de vehículos y ganado.",
  openGraph: {
    title: "Huella GPS — No pierdas la pista",
    description:
      "Localización en tiempo real de vehículos, flotas y animales. Alquiler sin permanencia, deposito reembolsable.",
    type: "website",
    locale: "es_ES",
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2238%22 r=%2222%22 fill=%22%23E8873D%22/><path d=%22M50 60 L50 90%22 stroke=%22%23E8873D%22 stroke-width=%2214%22 stroke-linecap=%22round%22/></svg>',
  },
};

// Must match the id used by loadGTM() in public/landing.js.
const GTM_CONTAINER_ID = "GTM-NN4MCZ9M";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bigShoulders.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Google Tag Manager (noscript): always renders for no-JS visitors;
            it can't be gated behind the cookie consent choice since that
            logic requires JavaScript. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="datalayer-init" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
        {children}
      </body>
    </html>
  );
}
