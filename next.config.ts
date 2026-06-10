import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
if (cloudName) {
  nextConfig.images ??= {};
  nextConfig.images.remotePatterns ??= [];
  nextConfig.images.remotePatterns.push({
    protocol: "https",
    hostname: `res.cloudinary.com`,
    pathname: `/${cloudName}/**`,
  });
}

export default nextConfig;
