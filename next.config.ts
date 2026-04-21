import type { NextConfig } from "next";
import createPWA from "next-pwa";

const withPWA = createPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
