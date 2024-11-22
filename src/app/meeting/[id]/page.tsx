/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/meeting/[id]/page.tsx
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useState, useEffect, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import { Video, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { userService } from "@/lib/userData";
interface MeetingPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function MeetingPage({ params }: MeetingPageProps) {
	const [user, setUser] = useState<any>(null);

	const router = useRouter();
	const [jitsiAPI, setJitsiAPI] = useState<any>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const meetingId = use(params).id;
	const JITSI_URL =
		process.env.NODE_ENV === "development"
			? process.env.NEXT_PUBLIC_JITSI_URL_LOCAL ||
			  "https://localhost:8443/external_api.js"
			: process.env.NEXT_PUBLIC_JITSI_URL ||
			  "https://meet.datafabdevelopment.com/external_api.js";

	// Fetch user data when component mounts
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const currentUser = await userService.getUser();
				setUser(currentUser);
			} catch (error) {
				console.error("Error fetching user:", error);
				toast.error("Failed to fetch user data");
			}
		};

		fetchUser();
	}, []);

	// Get user's display name from user metadata
	const displayName = user?.user_metadata?.name || user?.email || "Guest User";

	const loadJitsiScript = useCallback(() => {
		return new Promise<void>((resolve, reject) => {
			try {
				console.log("Starting to load Jitsi script...");
				const script = document.createElement("script");
				script.src = JITSI_URL;
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
			setError("Script loading failed. Check the backend server");
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

				const domain = "meet.datafabdevelopment.com";

				console.log("Creating meeting with:", { domain, meetingId });

				const options = {
					roomName: meetingId,
					width: "100%",
					height: "100%",
					parentNode: document.querySelector("#jitsiContainer"),
					userInfo: {
						displayName: displayName,
						email: user?.email,
					},
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
						watermark: {
							enabled: false,
							logo: "",
							link: "",
						},
						disableDeepLinking: true,
						// Add lobby/waiting room settings
						lobby: {
							enabled: true,
							autoKnock: true,
						},
						enableLobbyChat: false, // Disable chat in lobby
						requireDisplayName: true, // Force users to enter their name
						enableClosePage: false,
						enableInsecureRoomNameWarning: false,
					},
					interfaceConfigOverwrite: {
						TOOLBAR_BUTTONS: [
							"microphone",
							"camera",
							"closedcaptions",
							"desktop",
							"fullscreen",
							"settings",
							"raisehand",
							"videoquality",
							"filmstrip",
							"tileview",
							"participants-pane",
							"security", // Add security button to manage lobby
						],
						// ... rest of your interfaceConfigOverwrite settings ...
					},
				};
				console.log("Creating JitsiMeetExternalAPI instance...");
				const api = new window.JitsiMeetExternalAPI(domain, options);

				// Add lobby-related event listeners
				api.addEventListener(
					"participantKnocking",
					(knockingParticipant: any) => {
						console.log("Participant waiting in lobby:", knockingParticipant);
					}
				);

				api.addEventListener(
					"lobby.participant-access-granted",
					(participant: any) => {
						console.log("Participant admitted from lobby:", participant);
					}
				);

				api.addEventListener(
					"lobby.participant-access-denied",
					(participant: any) => {
						console.log("Participant denied from lobby:", participant);
					}
				);

				api.addEventListener("videoConferenceJoined", () => {
					console.log("Successfully joined conference");
				});

				api.addEventListener("connectionFailed", (error: any) => {
					console.error("Connection failed:", error);
					setError("Failed to connect to meeting server");
				});

				// api.addEventListener("errorOccurred", (error: any) => {
				// 	console.error("Jitsi error:", error);
				// 	setError(`Meeting error: ${error.error}`);
				// });

				console.log("API instance created successfully");
				setJitsiAPI(api);
			} catch (error: any) {
				console.error("Meeting start failed:", error);
				setError(error.message || "Failed to start meeting");
			}
		};

		if (isScriptLoaded && meetingId && !jitsiAPI && user) {
			startMeeting();
		}
	}, [isScriptLoaded, meetingId, jitsiAPI, user]);

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
					{/* Logo Container */}
					<div className="fixed left-4 top-4 z-50">
						<img
							src="/LogoLG2.png"
							alt="Company Logo"
							className="h-8 lg:h-12 md:h-12  rounded-lg mt-4"
						/>
					</div>

					<div id="jitsiContainer" className="w-full h-full" />
					<div className="fixed left-4 bottom-0 mb-20 sm:mb-16 md:mb-8 z-50">
						<div className="flex flex-col gap-3">
							<Button
								onClick={endMeeting}
								className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 p-0 flex items-center justify-center"
							>
								<Video className="h-4 w-4" />
							</Button>

							<Button
								onClick={copyMeetingLink}
								className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 p-0 flex items-center justify-center"
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
