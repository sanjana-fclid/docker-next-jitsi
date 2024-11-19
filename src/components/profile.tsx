/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserDropdown() {
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

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth]);

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

	const handleAuthRequired = () => {
		router.push("/auth/sign-in");
		toast.info("Please sign in to continue");
	};

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
				className="flex-1 bg-[#202E2D] hover:bg-[#244E5A] text-white"
			>
				Sign In
			</Button>
		);
	}

	return (
		<div className="flex items-center gap-2">
			{/* <span className="text-sm text-gray-600 dark:text-gray-400">
				{user.user_metadata?.name}
			</span> */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className="rounded-full">
						<img
							alt="Avatar"
							className="rounded-full"
							height="32"
							src={user.user_metadata?.avatar_url || <Avatar />}
							style={{ aspectRatio: "32/32", objectFit: "cover" }}
							width="32"
						/>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{user.user_metadata?.name}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Button
							variant="ghost"
							onClick={handleSignOut}
							className="flex-1 bg-[#d36464] hover:bg-[#bd4242] text-white w-full"
						>
							<LogOut className="mr-2 h-4 w-4" />
							Sign Out
						</Button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
