import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure pages using client-side state are not statically optimized
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
