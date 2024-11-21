import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import UserDropdown from "@/components/auth/profile";

interface HeaderProps {
	darkMode: boolean;
	setDarkMode: (darkMode: boolean) => void;
}

export const Header: FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
	// Set cookie function
	const setThemeCookie = (theme: "dark" | "light") => {
		const oneYear = 365 * 24 * 60 * 60;
		document.cookie = `datafab-theme=${theme}; max-age=${oneYear}; path=/; SameSite=Lax`;
	};

	// Handle theme toggle
	const handleThemeToggle = () => {
		const newTheme = !darkMode;
		setDarkMode(newTheme);
		setThemeCookie(newTheme ? "dark" : "light");
	};

	// Initialize theme from cookie on mount, default to dark if no cookie exists
	useEffect(() => {
		const cookies = document.cookie.split(";");
		const themeCookie = cookies.find((cookie) =>
			cookie.trim().startsWith("datafab-theme=")
		);

		if (themeCookie) {
			const savedTheme = themeCookie.split("=")[1].trim();
			setDarkMode(savedTheme === "dark");
		} else {
			// Set default to dark theme if no cookie exists
			setDarkMode(true);
			setThemeCookie("dark");
		}
	}, [setDarkMode]);

	return (
		<header className="relative z-10 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6">
			<div className="flex items-center gap-2">
				{darkMode ? (
					<img src="/LogoLGwhite.png" alt="DataFab Logo" className="h-6" />
				) : (
					<img src="/LogoLGblack.png" alt="DataFab Logo" className="h-6" />
				)}
			</div>
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
