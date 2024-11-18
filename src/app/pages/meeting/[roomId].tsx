import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import JitsiMeeting component dynamically to avoid SSR issues
const JitsiMeeting = dynamic(() => import("@/components/JitsiMeetup"), {
	ssr: false,
});

export default function MeetingRoom() {
	const router = useRouter();
	const { roomId } = router.query;
	const [userName, setUserName] = useState("");
	const [joinedMeeting, setJoinedMeeting] = useState(false);

	const handleMeetingEnd = () => {
		setJoinedMeeting(false);
		router.push("/");
	};

	if (!roomId) return null;

	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader>
					<CardTitle>Meeting Room: {roomId}</CardTitle>
				</CardHeader>
				<CardContent>
					{!joinedMeeting ? (
						<div className="space-y-4">
							<input
								type="text"
								placeholder="Enter your name"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								className="w-full p-2 border rounded"
							/>
							<Button
								onClick={() => setJoinedMeeting(true)}
								disabled={!userName}
								className="w-full"
							>
								Join Meeting
							</Button>
						</div>
					) : (
						<JitsiMeeting
							roomName={roomId as string}
							userDisplayName={userName}
							onMeetingEnd={handleMeetingEnd}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
