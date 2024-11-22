import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const domain = process.env.MAIN_DOMAIN!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		storage: {
			getItem: (key) => {
				// Get from cookies
				const value = document.cookie
					.split("; ")
					.find((row) => row.startsWith(key))
					?.split("=")[1];
				return value ? JSON.parse(decodeURIComponent(value)) : null;
			},
			setItem: (key, value) => {
				// Set cookie with domain
				document.cookie = `${key}=${encodeURIComponent(
					JSON.stringify(value)
				)}; domain=${domain}; path=/; secure; samesite=lax`;
			},
			removeItem: (key) => {
				// Remove cookie
				document.cookie = `${key}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
			},
		},
	},
});
