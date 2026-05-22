import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masjid Al Amanah Kementerian Keuangan",
  description: "Created by CakGup, Dit. SITP",
  openGraph: {
    title: "Masjid Al Amanah Kementerian Keuangan",
    description: "Created by CakGup, Dit. SITP",
    url: "https://cakgup.github.io/dashboard-masjid/",
    siteName: "Dashboard Masjid",
    images: [
      {
        url: "https://cakgup.github.io/dashboard-masjid/logo.png", // Sesuaikan dengan nama file gambar Anda
        width: 800,
        height: 800,
        alt: "Logo Masjid Al Amanah",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${oswald.variable} h-screen w-screen overflow-hidden antialiased`}
    >
      <body className="h-screen w-screen flex flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
