import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	// Get the current request URL and auth code from query params
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");

	if (code) {
		// Get cookie store instance
		const cookieStore = cookies();

		// Configure domain for cookie sharing across subdomains
		// Adds dot prefix (e.g. .example.com) to enable subdomain cookie sharing
		// Falls back to localhost for development
		const domain = process.env.MAIN_DOMAIN
			? `.${process.env.MAIN_DOMAIN}`
			: "localhost";

		// Create Supabase client with custom cookie options
		const supabase = createRouteHandlerClient(
			{
				cookies: () => cookieStore,
			},
			{
				cookieOptions: {
					domain: domain, // Domain for cookie sharing
					path: "/", // Cookie available across all paths
					sameSite: "lax", // Cookie security setting
					secure: process.env.NODE_ENV === "production", // HTTPS only in production
				},
			}
		);

		// Exchange the temporary code for a permanent session
		// This will set cookies with our custom domain configuration
		await supabase.auth.exchangeCodeForSession(code);
	}

	// Handle redirect after authentication
	if (process.env.NODE_ENV === "development") {
		// In development, redirect to localhost
		return NextResponse.redirect("http://localhost:3000");
	}

	// In production, redirect to the configured app URL or fallback to origin
	const redirectUrl =
		process.env.NEXT_PUBLIC_REACT_APP_URL || requestUrl.origin;
	return NextResponse.redirect(redirectUrl);
}

// Configure edge runtime for better performance
export const config = {
	runtime: "edge",
};
