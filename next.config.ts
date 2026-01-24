import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Partial Prerendering for better handling of dynamic pages
    ppr: 'incremental',
  },
  // Ensure pages using client-side state are not statically optimized
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
