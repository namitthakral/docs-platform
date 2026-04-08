import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'react-markdown',
    'remark-gfm',
    'rehype-highlight',
    'rehype-slug',
    'rehype-autolink-headings',
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle micromark ESM modules for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
