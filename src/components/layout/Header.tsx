import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import UserDropdown from "@/components/auth/profile";

interface HeaderProps {
	darkMode: boolean;
	setDarkMode: (darkMode: boolean) => void;
}

export const Header: FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
	const setThemeCookie = (theme: "dark" | "light") => {
		const cookieValue = `datafab-theme=${theme}; max-age=${
			365 * 24 * 60 * 60
		}; path=/; domain=.${
			process.env.THEME_DOMAIN || "localhost"
		}; SameSite=Lax`;

		document.cookie = cookieValue;

		console.log(`Cookie set: ${cookieValue}`);
	};

	const getThemeFromCookie = (): "dark" | "light" | null => {
		const cookies = document.cookie.split(";");
		const themeCookie = cookies.find((cookie) =>
			cookie.trim().startsWith("datafab-theme=")
		);

		if (themeCookie) {
			return themeCookie.split("=")[1].trim() as "dark" | "light";
		}
		return null;
	};

	// Handle cookie changes
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "datafab-theme") {
				const newTheme = event.newValue as "dark" | "light";
				setDarkMode(newTheme === "dark");
			}
		};

		// Create a cookie change interval checker
		const cookieCheckInterval = setInterval(() => {
			const currentTheme = getThemeFromCookie();
			if (currentTheme) {
				setDarkMode(currentTheme === "dark");
			}
		}, 1000); // Check every second

		// Listen for localStorage changes as a backup
		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			clearInterval(cookieCheckInterval);
		};
	}, [setDarkMode]);

	// Initial theme setup and dark mode class handling
	useEffect(() => {
		const savedTheme = getThemeFromCookie();

		if (savedTheme) {
			setDarkMode(savedTheme === "dark");
		} else {
			// Set default to dark theme if no cookie exists
			setDarkMode(true);
			setThemeCookie("dark");
		}
	}, []); // Run once on mount

	// Handle dark mode class separately to avoid race conditions
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const handleThemeToggle = () => {
		const newTheme = !darkMode;
		setDarkMode(newTheme);
		setThemeCookie(newTheme ? "dark" : "light");
		// Also set in localStorage to trigger storage event
		localStorage.setItem("datafab-theme", newTheme ? "dark" : "light");
	};

	return (
		<header className="relative z-10 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6">
			<a href="https://collab.datafabdevelpoment.com">
				<div className="flex items-center gap-2">
					{darkMode ? (
						<img src="/LogoLGwhite.png" alt="DataFab Logo" className="h-6" />
					) : (
						<img src="/LogoLGblack.png" alt="DataFab Logo" className="h-6" />
					)}
				</div>
			</a>
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleThemeToggle}
					className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
				>
					{darkMode ? (
						<Sun className="h-5 w-5" />
					) : (
						<Moon className="h-5 w-5" />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
				<UserDropdown />
			</div>
		</header>
	);
};
