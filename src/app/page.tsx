// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";

export default function HomePage() {
	const [darkMode, setDarkMode] = useState<boolean>(true);
	const [meetingId, setMeetingId] = useState<string>("");
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

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

	const gridBackground = {
		backgroundImage: `radial-gradient(circle, ${
			darkMode ? "#333333" : "#e5e5e5"
		} 1px, transparent 1px)`,
		backgroundSize: "30px 30px",
	};

	return (
		<div
			className={`min-h-screen ${
				darkMode ? "bg-black" : "bg-gray-100"
			} text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300`}
		>
			<div className="absolute inset-0 z-0">
				<div className="h-full w-full" style={gridBackground} />
			</div>

			<Header darkMode={darkMode} setDarkMode={setDarkMode} />

			<main className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-3.5rem-1px)] p-4 lg:p-8">
				<Hero
					startNewMeeting={startNewMeeting}
					joinMeeting={joinMeeting}
					meetingId={meetingId}
					setMeetingId={setMeetingId}
					loading={loading}
					darkMode={darkMode}
				/>
				<FeatureGrid darkMode={darkMode} />
			</main>
		</div>
	);
}
