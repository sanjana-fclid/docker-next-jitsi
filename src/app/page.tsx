"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Video,
	Settings,
	HelpCircle,
	Grid,
	Bell,
	LineChart,
	FileText,
	MessageSquare,
	Cloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
	const router = useRouter();
	const [meetingId, setMeetingId] = useState("");

	const generateMeetingId = () => {
		return `meeting-${Math.random().toString(36).substring(2, 7)}`;
	};

	const startNewMeeting = () => {
		const newMeetingId = generateMeetingId();
		router.push(`/meeting/${newMeetingId}`);
	};

	const joinMeeting = () => {
		if (meetingId) {
			router.push(`/meeting/${meetingId}`);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden">
			<div className="absolute inset-0 z-0">
				<div
					className="h-full w-full"
					style={{
						backgroundImage:
							"radial-gradient(circle, #333333 1px, transparent 1px)",
						backgroundSize: "30px 30px",
					}}
				/>
			</div>

			<header className="relative z-10 flex h-14 items-center justify-between border-b border-gray-700 px-4 lg:px-6">
				<div className="flex items-center gap-2">
					<Video className="h-6 w-6 text-blue-400" />
					<span className="text-lg font-semibold text-blue-400">DataFab</span>
				</div>
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-400 hover:text-white hover:bg-gray-800"
					>
						<HelpCircle className="h-5 w-5" />
						<span className="sr-only">Help</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-400 hover:text-white hover:bg-gray-800"
					>
						<Settings className="h-5 w-5" />
						<span className="sr-only">Settings</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-400 hover:text-white hover:bg-gray-800"
					>
						<Bell className="h-5 w-5" />
						<span className="sr-only">Notifications</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-400 hover:text-white hover:bg-gray-800"
					>
						<Grid className="h-5 w-5" />
						<span className="sr-only">Apps</span>
					</Button>
					<Button size="icon" variant="ghost" className="rounded-full">
						<img
							alt="Avatar"
							className="rounded-full"
							height="32"
							src="/placeholder.svg"
							style={{
								aspectRatio: "32/32",
								objectFit: "cover",
							}}
							width="32"
						/>
						<span className="sr-only">Profile</span>
					</Button>
				</div>
			</header>

			<main className="relative z-10 flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4 md:flex-row md:gap-12 lg:p-8">
				<div className="max-w-md text-center md:text-left">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-blue-400">
						Video calls and meetings for everyone
					</h1>
					<p className="mt-4 text-gray-300">
						Connect, collaborate, and celebrate from anywhere with DataFab
						Secure Collaboration Platform
					</p>
					<div className="mt-8 flex flex-col gap-4 sm:flex-row">
						<Button
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
							onClick={startNewMeeting}
						>
							<Video className="mr-2 h-4 w-4" />
							New meeting
						</Button>
						<div className="flex flex-1">
							<Input
								className="rounded-r-none bg-gray-800 border-gray-700 text-white placeholder-gray-500"
								placeholder="Enter meeting ID"
								value={meetingId}
								onChange={(e) => setMeetingId(e.target.value)}
							/>
							<Button
								variant="secondary"
								className="rounded-l-none bg-gray-700 hover:bg-gray-600 text-white"
								onClick={joinMeeting}
								disabled={!meetingId}
							>
								Join
							</Button>
						</div>
					</div>
					<div className="mt-4">
						<Link href="#" className="text-sm text-blue-400 hover:underline">
							Learn more
						</Link>{" "}
						<span className="text-sm text-gray-400">about DataFab</span>
					</div>
				</div>
				<div className="mt-8 md:mt-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="400"
						height="300"
						viewBox="0 0 400 300"
						className="max-w-sm"
					>
						<rect width="400" height="300" fill="#1F2937" rx="20" ry="20" />
						<circle cx="200" cy="150" r="70" fill="#374151" />
						<path
							d="M200 100 Q 230 100 250 120 Q 270 140 270 170 Q 270 200 250 220 Q 230 240 200 240 Q 170 240 150 220 Q 130 200 130 170 Q 130 140 150 120 Q 170 100 200 100 Z"
							fill="#4B5563"
						/>
						<circle cx="200" cy="150" r="40" fill="#6B7280" />
						<rect
							x="30"
							y="30"
							width="60"
							height="45"
							fill="#4B5563"
							rx="10"
							ry="10"
						/>
						<rect
							x="310"
							y="30"
							width="60"
							height="45"
							fill="#4B5563"
							rx="10"
							ry="10"
						/>
						<rect
							x="30"
							y="225"
							width="60"
							height="45"
							fill="#4B5563"
							rx="10"
							ry="10"
						/>
						<rect
							x="310"
							y="225"
							width="60"
							height="45"
							fill="#4B5563"
							rx="10"
							ry="10"
						/>
					</svg>
				</div>
			</main>

			<div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-t-3xl mt-12">
				{[
					{
						icon: <LineChart className="h-10 w-10 mb-4 text-blue-400" />,
						title: "Graph Draw",
						description: "Create and share interactive graphs in real-time",
						gradient: "from-blue-600 to-blue-400",
					},
					{
						icon: <FileText className="h-10 w-10 mb-4 text-green-400" />,
						title: "Live Document Sharing",
						description: "Collaborate on documents with real-time editing",
						gradient: "from-green-600 to-green-400",
					},
					{
						icon: <MessageSquare className="h-10 w-10 mb-4 text-purple-400" />,
						title: "Chats",
						description: "Instant messaging for quick team communication",
						gradient: "from-purple-600 to-purple-400",
					},
					{
						icon: <Cloud className="h-10 w-10 mb-4 text-yellow-400" />,
						title: "File Share Cloud",
						description: "Securely store and share files in the cloud",
						gradient: "from-yellow-600 to-yellow-400",
					},
				].map((feature, index) => (
					<div
						key={index}
						className="relative overflow-hidden rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
					>
						<div
							className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-75`}
						></div>
						<div className="relative z-10 p-6 h-full flex flex-col justify-between bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm">
							{feature.icon}
							<div>
								<h3 className="text-xl font-semibold mb-2 text-white">
									{feature.title}
								</h3>
								<p className="text-gray-200">{feature.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* <div className="fixed bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
				<Button
					variant="ghost"
					size="icon"
					className="h-2 w-2 rounded-full p-0 bg-gray-600"
				/>
				<Button
					variant="default"
					size="icon"
					className="h-2 w-2 rounded-full p-0 bg-blue-400"
				/>
				<Button
					variant="ghost"
					size="icon"
					className="h-2 w-2 rounded-full p-0 bg-gray-600"
				/>
			</div> */}
		</div>
	);
}
