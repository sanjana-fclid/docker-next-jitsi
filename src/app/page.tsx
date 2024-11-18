"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video } from "lucide-react";

declare global {
	interface Window {
		JitsiMeetExternalAPI: any;
	}
}

export default function Component() {
	const [jitsiAPI, setJitsiAPI] = useState<any>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	const [meetingId, setMeetingId] = useState("");
	const [error, setError] = useState<string | null>(null);

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
			const script = document.querySelector('script[src*="external_api.js"]');
			if (script?.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, [loadJitsiScript]);

	const startNewMeeting = async () => {
		try {
			setError(null);

			if (!isScriptLoaded) {
				throw new Error("Jitsi script not loaded yet");
			}

			if (typeof window.JitsiMeetExternalAPI !== "function") {
				throw new Error("JitsiMeetExternalAPI not available");
			}

			const domain = "localhost:8443";
			const roomName = `room${Math.random().toString(36).substring(7)}`;

			console.log("Creating meeting with:", { domain, roomName });

			const options = {
				roomName,
				width: "100%",
				height: "100%",
				parentNode: document.querySelector("#jitsiContainer"),
				configOverwrite: {
					prejoinPageEnabled: false,
					startWithAudioMuted: true,
					startWithVideoMuted: false,
					// Participant related settings
					disableRemoteMute: false, // Allow/disable participants to mute others
					disableRemoteRaiseHand: false, // Allow/disable raise hand feature
					remoteVideoMenu: {
						// Configure video menu for remote participants
						disableKick: false, // Allow/disable kicking participants
						disableGrantModerator: false, // Allow/disable granting moderator
						disablePrivateChat: false, // Allow/disable private chat
					},
					disableProfile: false, // Show/hide profile settings
					participantsPane: {
						enabled: true, // Enable/disable participants pane
						hideModeratorSettings: false, // Show/hide moderator settings
						hideMoreActionsButton: false, // Show/hide more actions button
						hideMuteAllButton: false, // Show/hide mute all button
					},
					// Moderator settings
					moderator: {
						enabled: true, // Enable moderator features
						skipGrantModerator: false, // Skip grant moderator dialog
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
						"participants-pane", // Add participants pane button
						"invite", // Add invite button
					],
					SETTINGS_SECTIONS: [
						"devices",
						"language",
						"moderator",
						"profile",
						"sounds",
					], // Configure available settings sections
					SHOW_JITSI_WATERMARK: false,
					DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
					TOOLBAR_ALWAYS_VISIBLE: true, // Keep toolbar visible
					VERTICAL_FILMSTRIP: true, // Show filmstrip vertically
					INITIAL_TOOLBAR_TIMEOUT: 20000, // Time before toolbar auto-hides
					DEFAULT_REMOTE_DISPLAY_NAME: "Participant", // Default name for participants
					DEFAULT_LOCAL_DISPLAY_NAME: "Me",
					SHOW_PROMOTIONAL_CLOSE_PAGE: false,
					HIDE_KICK_BUTTON_FOR_GUESTS: false,
					MOBILE_APP_PROMO: false,
					ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,
					TILE_VIEW_MAX_COLUMNS: 5, // Max columns in tile view
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

	const endMeeting = () => {
		if (jitsiAPI) {
			jitsiAPI.dispose();
			setJitsiAPI(null);
			setMeetingId("");
			setError(null);
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
				{error && (
					<div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-md">
						{error}
					</div>
				)}

				<div className="w-full max-w-4xl flex flex-col">
					{!jitsiAPI ? (
						<div className="text-center mb-8">
							<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-blue-400 mb-8">
								DataFab Meetings
							</h1>

							<Button
								className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white mb-4"
								onClick={startNewMeeting}
								disabled={!isScriptLoaded}
							>
								<Video className="mr-2 h-4 w-4" />
								{isScriptLoaded ? "Start New Meeting" : "Loading..."}
							</Button>

							<div className="flex gap-2 max-w-md mx-auto">
								<Input
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
									placeholder="Enter meeting ID"
									value={meetingId}
									onChange={(e) => setMeetingId(e.target.value)}
								/>
								<Button
									variant="secondary"
									className="bg-gray-700 hover:bg-gray-600 text-white"
									disabled={!meetingId || !isScriptLoaded}
								>
									Join
								</Button>
							</div>
						</div>
					) : null}

					{jitsiAPI ? (
						<div className="fixed inset-0 w-full h-full z-50">
							<div id="jitsiContainer" className="w-full h-full" />
							<Button
								onClick={endMeeting}
								className="absolute bottom-4 left-4 z-[60] bg-red-600 hover:bg-red-700 text-white"
							>
								End Meeting
							</Button>
						</div>
					) : (
						<div id="jitsiContainer" className="h-0" />
					)}
				</div>
			</main>
		</div>
	);
}
