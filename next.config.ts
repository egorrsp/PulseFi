import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        "**/test-ledger/**",
        "**/snapshot/**",
      ],
    };
    return config;
  },
}

export default nextConfig