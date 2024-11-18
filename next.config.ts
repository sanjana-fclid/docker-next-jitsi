const nextConfig = {
	// async headers() {
	// 	return [
	// 		{
	// 			source: "/:path*",
	// 			headers: [
	// 				{
	// 					key: "Content-Security-Policy",
	// 					value: `
	//           frame-ancestors 'self' https://${process.env.NEXT_PUBLIC_JITSI_DOMAIN};
	//           script-src 'self' 'unsafe-eval' 'unsafe-inline' https://${process.env.NEXT_PUBLIC_JITSI_DOMAIN};
	//           style-src 'self' 'unsafe-inline' https://${process.env.NEXT_PUBLIC_JITSI_DOMAIN};
	//           img-src 'self' data: blob: https://${process.env.NEXT_PUBLIC_JITSI_DOMAIN};
	//           media-src 'self' https://${process.env.NEXT_PUBLIC_JITSI_DOMAIN};
	//           connect-src 'self' wss://${process.env.NEXT_PUBLIC_JITSI_DOMAIN} https://${process.env.NEXT_PUBLIC_JITSI_DOMAIN};
	//         `
	// 						.replace(/\s+/g, " ")
	// 						.trim(),
	// 				},
	// 			],
	// 		},
	// 	];
	// },
	// If your Jitsi is using a self-signed certificate
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}
		return config;
	},
};

module.exports = nextConfig;
