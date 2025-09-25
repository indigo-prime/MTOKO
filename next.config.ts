import type { NextConfig } from "next";

const nextConfig = {
    experimental: {
        topLevelAwait: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pfmjyivdmjebvrvpyurd.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'maps.googleapis.com',
            },
        ],
        domains: ["lh3.googleusercontent.com"], // whitelist Google profile image domain
    },
};

export default nextConfig;
