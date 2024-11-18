/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, User, Star, Moon, Sun } from "lucide-react";
import { FaGithub, FaDiscord, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function ThemeToggleAuthPage() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(true);

	useEffect(() => {
		const darkModeMediaQuery = window.matchMedia(
			"(prefers-color-scheme: dark)"
		);
		setIsDarkMode(darkModeMediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
		darkModeMediaQuery.addEventListener("change", handleChange);

		return () => darkModeMediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleSignUp = () => {
		setIsSignUp(!isSignUp);
	};

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	const socialLoginButtons = [
		{
			icon: FaGithub,
			label: "GitHub",
			color: isDarkMode ? "#ffffff" : "#333333",
		},
		{ icon: FcGoogle, label: "Google", color: "currentColor" },
		{ icon: FaDiscord, label: "Discord", color: "#5865F2" },
		{
			icon: FaApple,
			label: "Apple",
			color: isDarkMode ? "#ffffff" : "#000000",
		},
	];

	return (
		<div
			className={`min-h-screen w-full flex flex-col lg:flex-row ${
				isDarkMode
					? "bg-[#0c1414] text-[#e0e7e7]"
					: "bg-[#f0f7f7] text-[#0c1414]"
			} transition-colors duration-300`}
		>
			{/* Auth form section */}
			<div className="w-full lg:w-1/2 p-4 md:p-8 flex flex-col">
				<header className="mb-8 flex justify-between items-center">
					<h1
						className={`text-2xl font-bold ${
							isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
						}`}
					>
						DataFab
					</h1>
					<button
						onClick={toggleTheme}
						className={`p-2 rounded-full ${
							isDarkMode
								? "bg-[#1a2424] text-[#e0e7e7]"
								: "bg-[#e0e7e7] text-[#0c1414]"
						}`}
						aria-label={
							isDarkMode ? "Switch to light mode" : "Switch to dark mode"
						}
					>
						{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</header>

				<main className="flex-grow flex items-center justify-center w-full">
					<div className="w-full max-w-md mx-auto">
						<h2
							className={`text-3xl md:text-4xl font-bold mb-2 ${
								isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
							}`}
						>
							{isSignUp ? "Create an account" : "Welcome Back"}
						</h2>
						<p
							className={`mb-6 ${
								isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"
							}`}
						>
							{isSignUp ? "Sign up to get started" : "Sign in to your account"}
						</p>

						{/* Social Login Buttons */}
						<div className="mb-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{socialLoginButtons.map((button, index) => (
									<button
										key={index}
										className={`flex items-center justify-center py-2 px-4 rounded-md transition duration-300 ${
											isDarkMode
												? "bg-[#1a2424] hover:bg-[#2d3c3c] text-[#e0e7e7]"
												: "bg-white hover:bg-[#e0e7e7] text-[#0c1414]"
										} border ${
											isDarkMode ? "border-[#2d3c3c]" : "border-[#c0d7d7]"
										}`}
									>
										<button.icon
											size={20}
											style={{ color: button.color }}
											className="mr-2"
										/>
										<span className="sr-only">Sign in with {button.label}</span>
										<span aria-hidden="true">{button.label}</span>
									</button>
								))}
							</div>
						</div>

						<div className="relative mb-6">
							<hr
								className={isDarkMode ? "border-[#2d3c3c]" : "border-[#c0d7d7]"}
							/>
							<span
								className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 ${
									isDarkMode
										? "bg-[#0c1414] text-[#7a8b8b]"
										: "bg-[#f0f7f7] text-[#4a6f6f]"
								}`}
							>
								or
							</span>
						</div>

						<form className="w-full">
							{isSignUp && (
								<div className="mb-4">
									<label
										htmlFor="name"
										className={`block mb-2 ${
											isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
										}`}
									>
										Name
									</label>
									<div
										className={`flex items-center border rounded-md ${
											isDarkMode
												? "border-[#2d3c3c] bg-[#1a2424]"
												: "border-[#c0d7d7] bg-white"
										}`}
									>
										<User
											className={`ml-2 ${
												isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"
											}`}
											size={20}
										/>
										<input
											type="text"
											id="name"
											className={`w-full p-2 rounded-md focus:outline-none ${
												isDarkMode
													? "bg-[#1a2424] text-[#e0e7e7]"
													: "bg-white text-[#0c1414]"
											}`}
											placeholder="John Doe"
										/>
									</div>
								</div>
							)}
							<div className="mb-4">
								<label
									htmlFor="email"
									className={`block mb-2 ${
										isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
									}`}
								>
									Email
								</label>
								<div
									className={`flex items-center border rounded-md ${
										isDarkMode
											? "border-[#2d3c3c] bg-[#1a2424]"
											: "border-[#c0d7d7] bg-white"
									}`}
								>
									<Mail
										className={`ml-2 ${
											isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"
										}`}
										size={20}
									/>
									<input
										type="email"
										id="email"
										className={`w-full p-2 rounded-md focus:outline-none ${
											isDarkMode
												? "bg-[#1a2424] text-[#e0e7e7]"
												: "bg-white text-[#0c1414]"
										}`}
										placeholder="you@example.com"
									/>
								</div>
							</div>
							<div className="mb-6">
								<label
									htmlFor="password"
									className={`block mb-2 ${
										isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
									}`}
								>
									Password
								</label>
								<div
									className={`flex items-center border rounded-md ${
										isDarkMode
											? "border-[#2d3c3c] bg-[#1a2424]"
											: "border-[#c0d7d7] bg-white"
									}`}
								>
									<Lock
										className={`ml-2 ${
											isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"
										}`}
										size={20}
									/>
									<input
										type="password"
										id="password"
										className={`w-full p-2 rounded-md focus:outline-none ${
											isDarkMode
												? "bg-[#1a2424] text-[#e0e7e7]"
												: "bg-white text-[#0c1414]"
										}`}
										placeholder="••••••••"
									/>
								</div>
							</div>
							<button
								type="submit"
								className={`w-full py-2 px-4 rounded-md ${
									isDarkMode
										? "bg-[#1e5454] text-[#e0e7e7] hover:bg-[#246767]"
										: "bg-[#1e5454] text-white hover:bg-[#246767]"
								} transition duration-300`}
							>
								{isSignUp ? "Sign Up" : "Sign In"}
							</button>
						</form>
						{!isSignUp && (
							<div className="mt-4 text-center">
								<a
									href="#"
									className={`text-sm ${
										isDarkMode
											? "text-[#4a8f8f] hover:text-[#5fafaf]"
											: "text-[#1e5454] hover:text-[#246767]"
									}`}
								>
									Forgot Password?
								</a>
							</div>
						)}
						<div className="mt-6 text-center">
							<p className={isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"}>
								{isSignUp
									? "Already have an account?"
									: "Don't have an account?"}{" "}
								<button
									onClick={toggleSignUp}
									className={`font-bold ${
										isDarkMode
											? "text-[#4a8f8f] hover:text-[#5fafaf]"
											: "text-[#1e5454] hover:text-[#246767]"
									}`}
								>
									{isSignUp ? "Sign In" : "Sign Up Now"}
								</button>
							</p>
						</div>
					</div>
				</main>
			</div>

			{/* Feature description section */}
			<div
				className={`w-full lg:w-1/2 ${
					isDarkMode ? "bg-[#0c1414]" : "bg-[#f0f7f7]"
				} p-4 md:p-8 flex flex-col justify-center`}
			>
				<div className="max-w-2xl mx-auto lg:ml-0">
					<h2
						className={`text-3xl md:text-4xl font-bold mb-4 ${
							isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
						}`}
					>
						Secure Collaboration Platform
					</h2>
					<p
						className={`mb-8 ${
							isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"
						}`}
					>
						Connect, collaborate, and celebrate from anywhere with DataFab
						Secure Collaboration Platform
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
						{[
							{
								title: "Graph Draw",
								description: "Create and share interactive graphs in real-time",
							},
							{
								title: "Live Document Sharing",
								description: "Collaborate on documents with real-time editing",
							},
							{
								title: "Chats",
								description: "Instant messaging for quick team communication",
							},
							{
								title: "File Share Cloud",
								description: "Securely store and share files in the cloud",
							},
						].map((feature, index) => (
							<div
								key={index}
								className={`${
									isDarkMode ? "bg-[#1a2424]" : "bg-white"
								} p-4 rounded-lg`}
							>
								<h3
									className={`text-xl font-semibold mb-2 ${
										isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
									}`}
								>
									{feature.title}
								</h3>
								<p className={isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"}>
									{feature.description}
								</p>
							</div>
						))}
					</div>
					<div
						className={`${
							isDarkMode ? "bg-[#1a2424]" : "bg-white"
						} p-4 rounded-lg`}
					>
						<p
							className={`mb-2 ${
								isDarkMode ? "text-[#e0e7e7]" : "text-[#0c1414]"
							}`}
						>
							"DataFab has revolutionized our team's collaboration. It's
							intuitive, secure, and packed with features we need."
						</p>
						<div className="flex items-center">
							<div className="flex mr-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={16}
										className="text-[#4a8f8f]"
										fill="currentColor"
									/>
								))}
							</div>
							<span
								className={`text-sm ${
									isDarkMode ? "text-[#7a8b8b]" : "text-[#4a6f6f]"
								}`}
							>
								Sarah K., Product Manager
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
