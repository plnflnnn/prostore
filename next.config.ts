import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ["192.168.219.103"],
	serverExternalPackages: ["@prisma/client", "@prisma/adapter-neon"],
	outputFileTracingIncludes: {
		"/*": ["./lib/generated/prisma/**/*"],
	},
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
	partialPrefetching: true,
	turbopack: {
		root: process.cwd(),
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'utfs.io',
			pathname: '/**',
		  },
		  {
			protocol: 'https',
			hostname: 'ufs.sh',
			pathname: '/**',
		  },
		  {
			protocol: 'https',
			hostname: '*.ufs.sh',
			pathname: '/**',
		  },
		],
	},
};

export default nextConfig;
