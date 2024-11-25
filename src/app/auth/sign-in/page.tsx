"use client";

import { useEffect } from "react";
import SignIn from "@/components/auth/sign-in";

const CookieCleaner = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		const clearAuthCookies = () => {
			const cookiesToDelete = [
				"sb-esimnlghtxeqngnnjzqs-auth-token",
				"sb-esimnlghtxeqngnnjzqs-auth-token-code-verifier",
			];

			const domains = [
				"", // no domain
				window.location.hostname,
				`.${window.location.hostname}`,
				"collab.datafabdevelopment.com",
			];

			cookiesToDelete.forEach((cookieName) => {
				domains.forEach((domain) => {
					const cookieString = domain
						? `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
						: `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

					document.cookie = cookieString;
				});
			});

			// Verify deletion
			const remainingCookies = document.cookie.split(";").map((c) => c.trim());
			const anyAuthCookiesLeft = remainingCookies.some((cookie) =>
				cookiesToDelete.some((name) => cookie.startsWith(`${name}=`))
			);

			if (anyAuthCookiesLeft) {
				console.warn("Some auth cookies still remain after deletion attempt");
			} else {
				console.log("All auth cookies successfully cleared");
			}
		};

		clearAuthCookies();
	}, []);

	return <>{children}</>;
};

// Metadata needs to stay in the original file since it's server-side
export default function AuthPage() {
	return (
		<CookieCleaner>
			<div className="">
				<SignIn />
			</div>
		</CookieCleaner>
	);
}
