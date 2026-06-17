import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bengalbeauties.com"),
  title: {
    default: "Bengal Beauties — Premium Companion Services",
    template: "%s | Bengal Beauties — Premium Companion Services",
  },
  description: "India's most exclusive companion service — discretion, elegance, and desire, delivered.",
  keywords: ["kolkata escorts", "call girl", "premium companionship", "Russian escort", "Bengal Beauties", "elite companion", "VIP escort"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Bengal Beauties",
    title: "Bengal Beauties — Premium Companion Services",
    description: "India's most exclusive companion service — discretion, elegance, and desire, delivered.",
    images: [{ url: "/images/logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="eoA3SeeFHMHRg4beIL8aFVDXILXL5S3kRg9u4qjIG-8" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
        <style>{`@font-face{font-family:'VeganStyle';src:url('/fonts/VeganStylePersonalUse-5Y58.ttf') format('truetype');font-weight:normal;font-style:normal;font-display:swap;}@font-face{font-family:'Vegan Style Personal Use';src:url('/fonts/VeganStylePersonalUse-5Y58.ttf') format('truetype');font-weight:normal;font-style:normal;font-display:swap;}`}</style>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
