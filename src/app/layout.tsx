import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIZA — Premium Companion Services",
  description: "India's most exclusive companion service — discretion, elegance, and desire, delivered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
        <style>{`@font-face{font-family:'VeganStyle';src:url('/fonts/VeganStylePersonalUse-5Y58.ttf') format('truetype');font-weight:normal;font-style:normal;font-display:swap;}@font-face{font-family:'Vegan Style Personal Use';src:url('/fonts/VeganStylePersonalUse-5Y58.ttf') format('truetype');font-weight:normal;font-style:normal;font-display:swap;}`}</style>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
