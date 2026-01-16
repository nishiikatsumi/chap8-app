import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.jp' },
      { protocol: 'https', hostname: 'images.microcms-assets.io' }, // これを追加
      { protocol: 'https', hostname: 'kxtcqhceifyllnrbfljm.supabase.co' }, // Supabaseストレージのホスト名を追加
    ],
  },
};


export default nextConfig;
