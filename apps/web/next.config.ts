import type { NextConfig } from 'next';
import path from 'path';

const monorepoRoot = path.resolve(__dirname, '../..');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingRoot: monorepoRoot,
  },
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
