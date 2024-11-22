/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className="rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={user.user_metadata?.avatar_url}
								alt={user.user_metadata?.name || "User avatar"}
							/>
							<AvatarFallback>
								<UserIcon className="h-4 w-4" />
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="" align="end" forceMount>
					<div className="flex flex-col items-center gap-4 p-4">
						<div className="relative">
							<Avatar className="h-12 w-12">
								<AvatarImage
									src={user.user_metadata?.avatar_url}
									alt={user.user_metadata?.name || "User avatar"}
									className="object-cover"
								/>
								<AvatarFallback className="text-2xl">
									<UserIcon className="h-12 w-12" />
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="flex flex-col space-y-1 text-center">
							<p className="text-md font-semibold leading-none">
								{user.user_metadata?.name}
							</p>
							<p className="text-sm leading-none text-muted-foreground">
								{user.email}
							</p>
						</div>
					</div>
					<DropdownMenuSeparator />
					<div className="p-2">
						<Button
							variant="ghost"
							onClick={handleSignOut}
							className="flex-1 bg-[#202E2D] hover:bg-[#244E5A] text-white w-full"
						>
							<LogOut className="mr-2 h-4 w-4" />
							Sign Out
						</Button>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
