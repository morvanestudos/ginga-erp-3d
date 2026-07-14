import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.2:3000",
    "*.trycloudflare.com",
  ],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
