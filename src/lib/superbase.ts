import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const domain = process.env.MAIN_DOMAIN
	? `.${process.env.MAIN_DOMAIN}`
	: "localhost";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		storage: {
			getItem: (key) => {
				const value = document.cookie
					.split("; ")
					.find((row) => row.startsWith(key))
					?.split("=")[1];
				return value ? JSON.parse(decodeURIComponent(value)) : null;
			},
			setItem: (key, value) => {
				document.cookie = `${key}=${encodeURIComponent(
					JSON.stringify(value)
				)}; domain=${domain}; path=/; ${
					process.env.NODE_ENV === "production" ? "secure; " : ""
				}samesite=lax`;
			},
			removeItem: (key) => {
				document.cookie = `${key}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
			},
		},
	},
});
