/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/auth-helpers-nextjs";
import {
	Video,
	Sun,
	Moon,
	LineChart,
	FileText,
	MessageSquare,
	Cloud,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Component() {
	const [darkMode, setDarkMode] = useState(true);
	const [meetingId, setMeetingId] = useState("");
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const checkUser = async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();
				if (error) throw error;
				setUser(user);
			} catch (error) {
				console.error("Error fetching user:", error);
				toast.error("Error fetching user data");
			} finally {
				setLoading(false);
			}
		};

		checkUser();
		document.documentElement.classList.toggle("dark", darkMode);

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth, darkMode]);

	const handleAuthRequired = () => {
		router.push("/auth/sign-in");
		toast.info("Please sign in to continue");
	};

	const generateMeetingId = () => {
		return `${Math.random().toString(36).substring(2, 7)}-${Math.random()
			.toString(36)
			.substring(2, 7)}`;
	};

	const startNewMeeting = () => {
		if (!user) {
			handleAuthRequired();
			return;
		}
		router.push(`/meeting/${generateMeetingId()}`);
	};

	const joinMeeting = () => {
		if (!user) {
			handleAuthRequired();
			return;
		}
		if (!meetingId.trim()) {
			toast.error("Please enter a meeting ID");
			return;
		}
		router.push(`/meeting/${meetingId}`);
	};

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			router.refresh();
			toast.success("Signed out successfully");
		} catch (error) {
			console.error("Error signing out:", error);
			toast.error("Failed to sign out");
		}
	};

	const ProfileButton = () => {
		if (loading) {
			return (
				<Button size="icon" variant="ghost" className="rounded-full opacity-50">
					<div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
				</Button>
			);
		}

		if (!user) {
			return (
				<Button
					variant="ghost"
					onClick={handleAuthRequired}
					className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
				>
					Sign In
				</Button>
			);
		}

		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600 dark:text-gray-400">
					{user.email}
				</span>
				<Button size="icon" variant="ghost" className="rounded-full">
					<img
						alt="Avatar"
						className="rounded-full"
						height="32"
						src={user.user_metadata?.avatar_url || "/api/placeholder/32/32"}
						style={{ aspectRatio: "32/32", objectFit: "cover" }}
						width="32"
					/>
				</Button>
				<Button
					variant="ghost"
					onClick={handleSignOut}
					className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
				>
					Sign Out
				</Button>
			</div>
		);
	};
	return (
		<div
			className={`min-h-screen ${
				darkMode ? "bg-black" : "bg-gray-100"
			} text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300`}
		>
			<div className="absolute inset-0 z-0">
				<div
					className="h-full w-full"
					style={{
						backgroundImage: `radial-gradient(circle, ${
							darkMode ? "#333333" : "#e5e5e5"
						} 1px, transparent 1px)`,
						backgroundSize: "30px 30px",
					}}
				/>
			</div>

			<header className="relative z-10 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6">
				<div className="flex items-center gap-2">
					<Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
					<span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
						DataFab
					</span>
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
					<ProfileButton />
				</div>
			</header>

			<main className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-3.5rem-1px)] p-4 lg:p-8">
				<div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl gap-12 mb-16 mt-8">
					<div className="max-w-md text-center md:text-left">
						<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-[#101717] dark:text-blue-400 dark:text-[#B2C3C1]">
							Video calls and meetings for everyone
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300">
							Connect, collaborate, and celebrate from anywhere with DataFab
							Secure Collaboration Platform
						</p>
						<div className="mt-8 flex flex-col gap-4 sm:flex-row">
							<Button
								className="flex-1 bg-[#202E2D] hover:bg-[#244E5A] text-white"
								onClick={startNewMeeting}
								disabled={loading}
							>
								<Video className="mr-2 h-4 w-4" />
								New meeting
							</Button>
							<div className="flex flex-1">
								<Input
									className="rounded-r-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
									placeholder="Enter the Code"
									value={meetingId}
									onChange={(e) => setMeetingId(e.target.value)}
								/>
								<Button
									variant="secondary"
									className="rounded-l-none bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
									onClick={joinMeeting}
									disabled={!meetingId.trim() || loading}
								>
									Join
								</Button>
							</div>
						</div>
						<div className="mt-4">
							<Link
								href="#"
								className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
							>
								Learn more
							</Link>{" "}
							<span className="text-sm text-gray-600 dark:text-gray-400">
								about DataFab
							</span>
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
				</div>

				<div className="grid grid-cols-1 flex flex-grow md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
					{[
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
					].map((feature, index) => (
						<div
							key={index}
							className="w-full max-w-sm mb-8 self-center justify-self-center"
						>
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
					))}
				</div>
			</main>
		</div>
	);
}
