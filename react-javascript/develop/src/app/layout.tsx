import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { logos } from "../static/js/endpoint_var"

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PIIA Geovisor",
  description: "Sistema de visualización epidemiológica",
  icons: {
    icon: [
      {
        url: logos.omicas,
        type: "image/png",
      },
    ],
    shortcut: logos.omicas,
    apple: logos.omicas,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className={`${inter.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}