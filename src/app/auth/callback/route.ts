import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");

	if (code) {
		const supabase = createRouteHandlerClient({ cookies });
		await supabase.auth.exchangeCodeForSession(code);
	}

	// In development, always redirect to localhost
	if (process.env.NODE_ENV === "development") {
		return NextResponse.redirect("http://localhost:3000");
	}

	// In production, use the configured app URL
	const redirectUrl =
		process.env.NEXT_PUBLIC_REACT_APP_URL || requestUrl.origin;
	return NextResponse.redirect(redirectUrl);
}

export const config = {
	runtime: "edge",
};
