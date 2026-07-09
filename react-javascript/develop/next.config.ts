import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "dorito-develop.com",
    "www.dorito-develop.com",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.dorito-develop.com",
        pathname: "/corporate-brand-assets/**",
      },
    ],
  },
};

export default nextConfig;