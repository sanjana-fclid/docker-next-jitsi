import { FC } from "react";

interface HeroIllustrationProps {
	darkMode: boolean;
}

export const HeroIllustration: FC<HeroIllustrationProps> = ({ darkMode }) => {
	return (
		<div className="mt-8 md:mt-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="400"
				height="300"
				viewBox="0 0 400 300"
				className="max-w-sm"
			>
				<rect
					width="400"
					height="300"
					fill={darkMode ? "#1F2937" : "#E5E7EB"}
					rx="20"
					ry="20"
				/>
				<circle
					cx="200"
					cy="150"
					r="70"
					fill={darkMode ? "#374151" : "#D1D5DB"}
				/>
				<path
					d="M200 100 Q 230 100 250 120 Q 270 140 270 170 Q 270 200 250 220 Q 230 240 200 240 Q 170 240 150 220 Q 130 200 130 170 Q 130 140 150 120 Q 170 100 200 100 Z"
					fill={darkMode ? "#4B5563" : "#9CA3AF"}
				/>
				<circle
					cx="200"
					cy="150"
					r="40"
					fill={darkMode ? "#6B7280" : "#6B7280"}
				/>
				<rect
					x="30"
					y="30"
					width="60"
					height="45"
					fill={darkMode ? "#4B5563" : "#9CA3AF"}
					rx="10"
					ry="10"
				/>
				<rect
					x="310"
					y="30"
					width="60"
					height="45"
					fill={darkMode ? "#4B5563" : "#9CA3AF"}
					rx="10"
					ry="10"
				/>
				<rect
					x="30"
					y="225"
					width="60"
					height="45"
					fill={darkMode ? "#4B5563" : "#9CA3AF"}
					rx="10"
					ry="10"
				/>
				<rect
					x="310"
					y="225"
					width="60"
					height="45"
					fill={darkMode ? "#4B5563" : "#9CA3AF"}
					rx="10"
					ry="10"
				/>
			</svg>
		</div>
	);
};
