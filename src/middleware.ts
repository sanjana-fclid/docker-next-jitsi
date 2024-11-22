import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	// Always add dot prefix to enable subdomain sharing
	const domain = process.env.MAIN_DOMAIN
		? `.${process.env.MAIN_DOMAIN}`
		: "localhost";

	console.log("Middleware Cookie Settings:", {
		mainDomain: process.env.MAIN_DOMAIN,
		calculatedDomain: domain,
		nodeEnv: process.env.NODE_ENV,
		currentUrl: req.url,
	});

	const supabase = createMiddlewareClient(
		{ req, res },
		{
			cookieOptions: {
				domain: domain,
				path: "/",
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
		}
	);

	const session = await supabase.auth.getSession();
	console.log("Auth Session Result:", {
		hasSession: !!session.data.session,
		cookieDomain: domain,
		currentUrl: req.url,
	});

	return res;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
