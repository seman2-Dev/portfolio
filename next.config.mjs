import path from 'node:path';
import { fileURLToPath } from 'node:url';
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};
export default nextConfig;
