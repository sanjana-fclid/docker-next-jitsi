// app/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";

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

			<main className="relative z-10 flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4">
				<div className="w-full max-w-4xl flex flex-col">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-blue-400 mb-8">
							DataFab Meetings
						</h1>

						<Button
							className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white mb-4"
							onClick={startNewMeeting}
						>
							<Video className="mr-2 h-4 w-4" />
							Start New Meeting
						</Button>

						<div className="flex gap-2 max-w-md mx-auto">
							<Input
								className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
								placeholder="Enter meeting ID"
								value={meetingId}
								onChange={(e) => setMeetingId(e.target.value)}
							/>
							<Button
								onClick={joinMeeting}
								variant="secondary"
								className="bg-gray-700 hover:bg-gray-600 text-white"
								disabled={!meetingId}
							>
								Join
							</Button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
