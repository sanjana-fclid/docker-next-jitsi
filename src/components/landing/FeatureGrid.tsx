import { FC } from "react";
import { LineChart, FileText, MessageSquare, Cloud } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import type { Feature } from "@/types";
import Link from "next/link";

interface FeatureGridProps {
	darkMode: boolean;
}

export const FeatureGrid: FC<FeatureGridProps> = ({ darkMode }) => {
	const features: (Feature & { href: string })[] = [
		{
			icon: <LineChart className="h-8 w-8" />,
			title: "Graph Draw",
			description: "Create and share interactive graphs in real-time",
			gradient: "from-blue-600 to-blue-400",
			href: "https://chart.datafabdevelopment.com",
		},
		{
			icon: <FileText className="h-8 w-8" />,
			title: "Live Document Sharing",
			description: "Collaborate on documents with real-time editing",
			gradient: "from-green-600 to-green-400",
			href: "https://docs.datafabdevelopment.com",
		},
		{
			icon: <MessageSquare className="h-8 w-8" />,
			title: "Chats",
			description: "Instant messaging for quick team communication",
			gradient: "from-purple-600 to-purple-400",
			href: "https://chat.datafabdevelopment.com",
		},
		{
			icon: <Cloud className="h-8 w-8" />,
			title: "File Share Cloud",
			description: "Securely store and share files in the cloud",
			gradient: "from-yellow-600 to-yellow-400",
			href: "https://files.datafabdevelopment.com",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
			{features.map((feature, index) => (
				<Link
					key={index}
					href={feature.href}
					className="block transition-transform hover:scale-105"
				>
					<FeatureCard feature={feature} darkMode={darkMode} />
				</Link>
			))}
		</div>
	);
};
