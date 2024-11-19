import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import UserDropdown from "@/components/auth/profile";

interface HeaderProps {
	darkMode: boolean;
	setDarkMode: (darkMode: boolean) => void;
}

export const Header: FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
	return (
		<header className="relative z-10 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6">
			<div className="flex items-center gap-2">
				{darkMode ? (
					<img src="/LogoLGwhite.png" alt="DataFab Logo" className="h-12" />
				) : (
					<img src="/LogoLGblack.png" alt="DataFab Logo" className="h-12" />
				)}
			</div>
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setDarkMode(!darkMode)}
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
