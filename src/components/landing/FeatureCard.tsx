import { FC } from "react";
import type { Feature } from "@/types";

interface FeatureCardProps {
	feature: Feature;
	darkMode: boolean;
}

export const FeatureCard: FC<FeatureCardProps> = ({ feature, darkMode }) => {
	return (
		<div className="w-full max-w-sm mb-8 self-center justify-self-center">
			<div className="overflow-hidden rounded-2xl shadow-lg transition-all duration-300 bg-gradient-to-br from-[#4F7D8A]/10 to-[#244E5A]/10 backdrop-blur-xl border border-[#4F7D8A]/20 dark:from-[#1a2e2e] dark:to-[#0d1616]">
				<div className={`p-6 h-56 ${!darkMode ? "relative" : ""}`}>
					{!darkMode && (
						<>
							<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent"></div>
							<div className="absolute -top-20 -left-20 w-40 h-40 bg-[#4F7D8A] rounded-full opacity-10 blur-3xl"></div>
							<div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#244E5A] rounded-full opacity-10 blur-3xl"></div>
						</>
					)}
					<div className="relative mb-4 text-[#244E5A] dark:text-[#4F7D8A]">
						{feature.icon}
					</div>
					<h2 className="relative text-2xl font-bold mb-2 text-[#244E5A] dark:text-[#E4EAEA]">
						{feature.title}
					</h2>
					<p className="relative text-[#4F7D8A] dark:text-[#4F7D8A] opacity-90">
						{feature.description}
					</p>
				</div>
			</div>
		</div>
	);
};
