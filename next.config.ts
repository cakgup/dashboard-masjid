import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/dashboard-masjid', // Sesuaikan dengan nama repository
  assetPrefix: '/dashboard-masjid/',
  trailingSlash: true,
  images: {
    unoptimized: true, // Wajib diaktifkan karena GitHub Pages tidak mendukung Next.js Image Optimization bawaan
  },
};

export default nextConfig;