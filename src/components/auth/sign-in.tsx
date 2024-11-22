/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, User, Star, Moon, Sun } from "lucide-react";
import { FaGithub, FaDiscord, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "../layout/Header";

export default function ThemeToggleAuthPage() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [darkMode, setDarkMode] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode]);

	const gridBackground = {
		backgroundImage: `radial-gradient(circle, ${
			darkMode ? "#333333" : "#e5e5e5"
		} 1px, transparent 1px)`,
		backgroundSize: "30px 30px",
	};

	const toggleSignUp = () => {
		setIsSignUp(!isSignUp);
	};

	const toggleTheme = () => {
		setDarkMode(!darkMode);
	};

	const socialLoginButtons = [
		{
			icon: FaGithub,
			label: "GitHub",
			color: darkMode ? "#ffffff" : "#333333",
			onClick: async () => {
				setError(null);
				try {
					const { error } = await supabase.auth.signInWithOAuth({
						provider: "github",
						options: {
							redirectTo: `${window.location.origin}/auth/callback`,
						},
					});
					if (error) throw error;
				} catch (err) {
					setError(err instanceof Error ? err.message : "An error occurred");
					toast.error(err instanceof Error ? err.message : "An error occurred");
				}
			},
		},
		{
			icon: FcGoogle,
			label: "Google",
			color: "currentColor",
			onClick: async () => {
				setError(null);
				try {
					const { error } = await supabase.auth.signInWithOAuth({
						provider: "google",
						options: {
							redirectTo: `${window.location.origin}/auth/callback`,
						},
					});
					if (error) throw error;
				} catch (err) {
					setError(err instanceof Error ? err.message : "An error occurred");
					toast.error(err instanceof Error ? err.message : "An error occurred");
				}
			},
		},
		{
			icon: FaDiscord,
			label: "Discord",
			color: "#5865F2",
			onClick: async () => {
				setError(null);
				try {
					const { error } = await supabase.auth.signInWithOAuth({
						provider: "discord",
						options: {
							redirectTo: `${window.location.origin}/auth/callback`,
						},
					});
					if (error) throw error;
				} catch (err) {
					setError(err instanceof Error ? err.message : "An error occurred");
					toast.error(err instanceof Error ? err.message : "An error occurred");
				}
			},
		},
		{
			icon: FaApple,
			label: "Apple",
			color: darkMode ? "#ffffff" : "#000000",
			onClick: async () => {
				setError(null);
				try {
					const { error } = await supabase.auth.signInWithOAuth({
						provider: "apple",
						options: {
							redirectTo: `${window.location.origin}/auth/callback`,
						},
					});
					if (error) throw error;
				} catch (err) {
					setError(err instanceof Error ? err.message : "An error occurred");
					toast.error(err instanceof Error ? err.message : "An error occurred");
				}
			},
		},
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (isSignUp) {
				const { error: signUpError } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							full_name: name,
						},
					},
				});
				if (signUpError) throw signUpError;
				else {
					toast.success("Check your email to confirm your account");
				}
			} else {
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (signInError) throw signInError;
				else {
					toast.success("Successfully signed in");
					router.push("/");
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			toast.error(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
			<div className="absolute inset-0 z-0">
				<div className="h-full w-full" style={gridBackground} />
			</div>
			<div className="w-full z-20">
				<Header darkMode={darkMode} setDarkMode={setDarkMode} />
			</div>
			<div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
				{/* Auth form section */}
				<div className="w-full lg:w-1/2 p-4 md:p-8 flex flex-col">
					{/* <header className="mb-8 flex justify-between items-center">
						<div className="flex items-center gap-2">
							<img
								src={darkMode ? "/LogoLGwhite.png" : "/LogoLGblack.png"}
								alt="DataFab Logo"
								className="h-6"
							/>
						</div>
						<button
							onClick={toggleTheme}
							className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
							aria-label={
								darkMode ? "Switch to light mode" : "Switch to dark mode"
							}
						>
							{darkMode ? <Sun size={20} /> : <Moon size={20} />}
						</button>
					</header> */}

					<main className="flex-grow flex items-center justify-center w-full">
						<div className="w-full max-w-md mx-auto space-y-6">
							<div className="space-y-2">
								<h2 className="text-3xl md:text-4xl font-bold">
									{isSignUp ? "Create an account" : "Welcome Back"}
								</h2>
								<p className="text-muted-foreground">
									{isSignUp
										? "Sign up to get started"
										: "Sign in to your account"}
								</p>
							</div>

							{/* Social Login Buttons */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{socialLoginButtons.map((button, index) => (
									<button
										key={index}
										onClick={button.onClick}
										type="button"
										className="flex items-center justify-center py-2 px-4 rounded-md 
                             bg-card hover:bg-muted transition-colors duration-300
                             border border-border"
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

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-border" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										or
									</span>
								</div>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								{isSignUp && (
									<div className="space-y-2">
										<label htmlFor="name" className="block text-sm font-medium">
											Name
										</label>
										<div className="flex items-center border rounded-md bg-card border-input">
											<User className="ml-2 text-muted-foreground" size={20} />
											<input
												type="text"
												id="name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="w-full p-2 bg-transparent focus:outline-none"
												placeholder="John Doe"
											/>
										</div>
									</div>
								)}

								<div className="space-y-2">
									<label htmlFor="email" className="block text-sm font-medium">
										Email
									</label>
									<div className="flex items-center border rounded-md bg-card border-input">
										<Mail className="ml-2 text-muted-foreground" size={20} />
										<input
											type="email"
											id="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full p-2 bg-transparent focus:outline-none"
											placeholder="you@example.com"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="password"
										className="block text-sm font-medium"
									>
										Password
									</label>
									<div className="flex items-center border rounded-md bg-card border-input">
										<Lock className="ml-2 text-muted-foreground" size={20} />
										<input
											type="password"
											id="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="w-full p-2 bg-transparent focus:outline-none"
											placeholder="••••••••"
										/>
									</div>
								</div>

								{error && (
									<div className="text-destructive text-sm text-center">
										{error}
									</div>
								)}

								<button
									type="submit"
									disabled={loading}
									className="w-full py-2 px-4 rounded-md  disabled:cursor-not-allowed flex-1 bg-[#202E2D] hover:bg-[#244E5A] text-white"
								>
									{loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
								</button>
							</form>

							{!isSignUp && (
								<div className="text-center">
									<a href="#" className="text-sm text-primary hover:underline">
										Forgot Password?
									</a>
								</div>
							)}

							<div className="text-center">
								<p className="text-muted-foreground">
									{isSignUp
										? "Already have an account?"
										: "Don't have an account?"}{" "}
									<button
										onClick={toggleSignUp}
										className="w-full py-2 px-4 rounded-md mt-2 flex-1 bg-[#202E2D] hover:bg-[#244E5A] text-white"
									>
										{isSignUp ? "Sign In" : "Sign Up Now"}
									</button>
								</p>
							</div>
						</div>
					</main>
				</div>

				{/* Feature description section */}
				<div className="w-full lg:w-1/2 relative z-10 p-4 md:p-8 flex flex-col justify-center bg-muted/50">
					<div className="max-w-2xl mx-auto lg:ml-0 space-y-8">
						<div className="space-y-4">
							<h2 className="text-3xl md:text-4xl font-bold">
								Secure Collaboration Platform
							</h2>
							<p className="text-muted-foreground">
								Connect, collaborate, and celebrate from anywhere with DataFab
								Secure Collaboration Platform
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								{
									title: "Graph Draw",
									description:
										"Create and share interactive graphs in real-time",
								},
								{
									title: "Live Document Sharing",
									description:
										"Collaborate on documents with real-time editing",
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
								<div key={index} className="bg-card p-4 rounded-lg space-y-2">
									<h3 className="text-xl font-semibold">{feature.title}</h3>
									<p className="text-muted-foreground">{feature.description}</p>
								</div>
							))}
						</div>

						<div className="bg-card p-4 rounded-lg space-y-4">
							<p>
								&ldquo;DataFab has revolutionized our team's collaboration. It's
								intuitive, secure, and packed with features we need."
							</p>
							<div className="flex items-center gap-2">
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={16}
											className="text-primary"
											fill="currentColor"
										/>
									))}
								</div>
								<span className="text-sm text-muted-foreground">
									Sarah K., Product Manager
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
