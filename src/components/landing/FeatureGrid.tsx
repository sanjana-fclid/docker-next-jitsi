import { FC } from "react";
import { LineChart, FileText, MessageSquare, Cloud } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import type { Feature } from "@/types";

interface FeatureGridProps {
	darkMode: boolean;
}

export const FeatureGrid: FC<FeatureGridProps> = ({ darkMode }) => {
	const features: Feature[] = [
		{
			icon: <LineChart className="h-8 w-8" />,
			title: "Graph Draw",
			description: "Create and share interactive graphs in real-time",
			gradient: "from-blue-600 to-blue-400",
		},
		{
			icon: <FileText className="h-8 w-8" />,
			title: "Live Document Sharing",
			description: "Collaborate on documents with real-time editing",
			gradient: "from-green-600 to-green-400",
		},
		{
			icon: <MessageSquare className="h-8 w-8" />,
			title: "Chats",
			description: "Instant messaging for quick team communication",
			gradient: "from-purple-600 to-purple-400",
		},
		{
			icon: <Cloud className="h-8 w-8" />,
			title: "File Share Cloud",
			description: "Securely store and share files in the cloud",
			gradient: "from-yellow-600 to-yellow-400",
		},
	];

	return (
		<div className="grid grid-cols-1 flex flex-grow md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
			{features.map((feature, index) => (
				<FeatureCard key={index} feature={feature} darkMode={darkMode} />
			))}
		</div>
	);
};
