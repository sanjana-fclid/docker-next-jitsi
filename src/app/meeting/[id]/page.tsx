/* eslint-disable @typescript-eslint/no-explicit-any */
// app/meeting/[id]/page.tsx
"use client";
import { useState, useEffect, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import { Video, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingPageProps {
	params: {
		id: string;
	};
}

export default function MeetingPage({ params }: MeetingPageProps) {
	const router = useRouter();
	const [jitsiAPI, setJitsiAPI] = useState<any>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const meetingId = use(params).id;

	const loadJitsiScript = useCallback(() => {
		return new Promise<void>((resolve, reject) => {
			try {
				console.log("Starting to load Jitsi script...");
				const script = document.createElement("script");
				script.src = "https://localhost:8443/external_api.js";
				script.async = true;

				script.onload = () => {
					console.log("Jitsi script loaded successfully");
					setIsScriptLoaded(true);
					resolve();
				};

				script.onerror = (e) => {
					console.error("Error loading Jitsi script:", e);
					reject(new Error("Failed to load Jitsi script"));
				};

				document.body.appendChild(script);
			} catch (e) {
				console.error("Exception while loading script:", e);
				reject(e);
			}
		});
	}, []);

	useEffect(() => {
		loadJitsiScript().catch((err) => {
			console.error("Script loading failed:", err);
			setError("Failed to load Jitsi script");
		});

		return () => {
			if (jitsiAPI) {
				jitsiAPI.dispose();
			}
			const script = document.querySelector('script[src*="external_api.js"]');
			if (script?.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, [loadJitsiScript, jitsiAPI]);

	useEffect(() => {
		const startMeeting = async () => {
			try {
				setError(null);

				if (!isScriptLoaded) {
					return; // Wait for script to load
				}

				if (typeof window.JitsiMeetExternalAPI !== "function") {
					throw new Error("JitsiMeetExternalAPI not available");
				}

				const domain = "localhost:8443";

				console.log("Creating meeting with:", { domain, meetingId });

				const options = {
					roomName: meetingId,
					width: "100%",
					height: "100%",
					parentNode: document.querySelector("#jitsiContainer"),
					configOverwrite: {
						prejoinPageEnabled: false,
						startWithAudioMuted: true,
						startWithVideoMuted: false,
						disableRemoteMute: false,
						disableRemoteRaiseHand: false,
						remoteVideoMenu: {
							disableKick: false,
							disableGrantModerator: false,
							disablePrivateChat: false,
						},
						disableProfile: false,
						participantsPane: {
							enabled: true,
							hideModeratorSettings: false,
							hideMoreActionsButton: false,
							hideMuteAllButton: false,
						},
						moderator: {
							enabled: true,
							skipGrantModerator: false,
						},
					},
					interfaceConfigOverwrite: {
						TOOLBAR_BUTTONS: [
							"microphone",
							"camera",
							"closedcaptions",
							"desktop",
							"fullscreen",
							"chat",
							"settings",
							"raisehand",
							"videoquality",
							"filmstrip",
							"tileview",
							"participants-pane",
						],
						SETTINGS_SECTIONS: [
							"devices",
							"language",
							"moderator",
							"profile",
							"sounds",
						],
						SHOW_JITSI_WATERMARK: false,
						DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
						TOOLBAR_ALWAYS_VISIBLE: true,
						VERTICAL_FILMSTRIP: true,
						INITIAL_TOOLBAR_TIMEOUT: 20000,
						DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
						DEFAULT_LOCAL_DISPLAY_NAME: "Me",
						SHOW_PROMOTIONAL_CLOSE_PAGE: false,
						HIDE_KICK_BUTTON_FOR_GUESTS: false,
						MOBILE_APP_PROMO: false,
						ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,
						TILE_VIEW_MAX_COLUMNS: 5,
					},
				};

				console.log("Creating JitsiMeetExternalAPI instance...");
				const api = new window.JitsiMeetExternalAPI(domain, options);

				api.addEventListener("videoConferenceJoined", () => {
					console.log("Successfully joined conference");
				});

				api.addEventListener("connectionFailed", (error: any) => {
					console.error("Connection failed:", error);
					setError("Failed to connect to meeting server");
				});

				api.addEventListener("errorOccurred", (error: any) => {
					console.error("Jitsi error:", error);
					setError(`Meeting error: ${error.error}`);
				});

				console.log("API instance created successfully");
				setJitsiAPI(api);
			} catch (error: any) {
				console.error("Meeting start failed:", error);
				setError(error.message || "Failed to start meeting");
			}
		};

		if (isScriptLoaded && meetingId && !jitsiAPI) {
			startMeeting();
		}
	}, [isScriptLoaded, meetingId, jitsiAPI]);

	const copyMeetingLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			// You could add a toast notification here
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const endMeeting = () => {
		if (jitsiAPI) {
			jitsiAPI.dispose();
			setJitsiAPI(null);
			router.push("/");
		}
	};

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden">
			{error ? (
				<div className="flex items-center justify-center h-screen">
					<div className="text-center">
						<div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-md">
							{error}
						</div>
						<Button
							onClick={() => router.push("/")}
							className="bg-blue-600 hover:bg-blue-700"
						>
							Return Home
						</Button>
					</div>
				</div>
			) : (
				<div className="fixed inset-0 w-full h-full z-50">
					<div id="jitsiContainer" className="w-full h-full" />
					<div className="absolute bottom-4 left-4 flex gap-2 z-[60]">
						<Button
							onClick={endMeeting}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							End Meeting
						</Button>
						<Button
							onClick={copyMeetingLink}
							className="bg-blue-600 hover:bg-blue-700 text-white"
						>
							<Copy className="h-4 w-4 mr-2" />
							Copy Link
						</Button>
						<div className="px-3 py-2 bg-gray-800 rounded-md text-sm">
							Meeting ID: {meetingId}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
