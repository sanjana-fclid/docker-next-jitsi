import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	// Add dot prefix for production domain to enable subdomain sharing
	const domain =
		process.env.MAIN_DOMAIN && process.env.NODE_ENV === "production"
			? `.${process.env.MAIN_DOMAIN}` // Adds dot for production (e.g. .datafabdevelopment.com)
			: process.env.MAIN_DOMAIN; // Keeps as is for localhost

	const supabase = createMiddlewareClient(
		{ req, res },
		{
			cookieOptions: {
				domain: domain,
				path: "/",
				sameSite: "lax",
				secure: true,
			},
		}
	);

	await supabase.auth.getSession();
	return res;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
