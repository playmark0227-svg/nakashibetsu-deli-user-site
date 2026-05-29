import type { NextConfig } from "next";
import path from "node:path";

const isProd = process.env.NODE_ENV === "production";
// Project pages served at https://<user>.github.io/<repo>/
const repoName = "nakashibetsu-deli-user-site";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // 親ディレクトリにある無関係な package-lock.json を誤ってルート推定しないよう、
  // このプロジェクトをワークスペースルートとして明示する。
  turbopack: {
    root: path.resolve(__dirname),
  },
  basePath: isProd ? `/${repoName}` : undefined,
  assetPrefix: isProd ? `/${repoName}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzkhzvlckrvxxrfffexx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
