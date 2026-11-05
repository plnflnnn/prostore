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
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

export default nextConfig;
