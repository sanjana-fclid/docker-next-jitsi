import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video } from "lucide-react";
import Link from "next/link";
import { HeroIllustration } from "@/components/svg/HeroIllustration";

interface HeroProps {
	startNewMeeting: () => void;
	joinMeeting: () => void;
	meetingId: string;
	setMeetingId: (id: string) => void;
	loading: boolean;
	darkMode: boolean;
}

export const Hero: FC<HeroProps> = ({
	startNewMeeting,
	joinMeeting,
	meetingId,
	setMeetingId,
	loading,
	darkMode,
}) => {
	return (
		<div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl gap-12 mb-16 mt-8">
			<div className="max-w-md text-center md:text-left">
				<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-[#101717] dark:text-gray-300">
					Collaboration Platform for Everyone
				</h1>
				<p className="mt-4 text-gray-600 dark:text-gray-300 font-sans tracking-tighter">
					Connect, collaborate, and celebrate from anywhere with DataFab Secure
					Collaboration Platform
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
			<HeroIllustration darkMode={darkMode} />
		</div>
	);
};
