/* eslint-disable @typescript-eslint/no-explicit-any */
const nextConfig = {
	output: "standalone", // This tells Next.js to export static files
	// Your existing webpack config
	webpack: (config: { resolve: { fallback: any } }, { isServer }: any) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}
		return config;
	},
};

export default nextConfig;
