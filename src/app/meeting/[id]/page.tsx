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

declare global {
	interface Window {
		JitsiMeetExternalAPI: any;
	}
}

export default function MeetingPage({ params }: MeetingPageProps) {
	const [user, setUser] = useState<any>(null);
	const router = useRouter();
	const [jitsiAPI, setJitsiAPI] = useState<any>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const meetingId = use(params).id;
	const JITSI_URL = "https://meet.datafabdevelopment.com/external_api.js";

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const currentUser = await userService.getUser();
				setUser(currentUser);
			} catch (error) {
				console.error("Error fetching user:", error);
				const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
				router.push(`${baseUrl}/auth/sign-in`);
			}
		};

		fetchUser();
	}, [router]);

	const displayName = user?.user_metadata?.name || user?.email || "Guest User";

	const loadJitsiScript = useCallback(() => {
		return new Promise<void>((resolve, reject) => {
			try {
				console.log("Starting to load Meet script...");
				const script = document.createElement("script");
				script.src = JITSI_URL;
				script.async = true;

				script.onload = () => {
					console.log("Meet script loaded successfully");
					setIsScriptLoaded(true);
					resolve();
				};

				script.onerror = (e) => {
					console.error("Error loading Meet script:", e);
					reject(new Error("Failed to load Meet script"));
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
					return;
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
						p2pTestMode: true,
						prejoinPageEnabled: true,
						startWithAudioMuted: true,
						startWithVideoMuted: false,
						disableRemoteMute: false,
						disableRemoteRaiseHand: false,
						// Main toolbar configuration
						toolbarButtons: [
							"microphone",
							"camera",
							"desktop",
							//"custom-leave",
							"hangup",
							"chat",
							"participants-pane",
							"tileview",
							"raisehand",
							"videoquality",
							"filmstrip",
							"security",
						],
						// Ensure button appears in main toolbar
						// mainToolbarButtons: [
						// 	["microphone", "camera", "desktop", "custom-leave", "hangup"],
						// ],
						// //buttonsWithNotifyClick: ["custom-leave"],
						// customToolbarButtons: [
						// 	{
						// 		id: "custom-leave",
						// 		text: "Return to Collab",
						// 		className: "custom-leave-button",
						// 		icon: "fa fa-sign-out",
						// 		backgroundColor: "#1a73e8",
						// 	},
						// ],
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
						lobby: {
							enabled: true,
							autoKnock: true,
						},
						enableLobbyChat: false,
						requireDisplayName: true,
						enableClosePage: false,
						enableInsecureRoomNameWarning: false,
					},
					interfaceConfigOverwrite: {
						TOOLBAR_BUTTONS: [
							"microphone",
							"camera",
							"desktop",
							//"custom-leave",
							"hangup",
							"chat",
							"participants-pane",
							"tileview",
							"raisehand",
							"videoquality",
							"filmstrip",
							"security",
						],
						TOOLBAR_ALWAYS_VISIBLE: true,
						SHOW_CHROME_EXTENSION_BANNER: false,
					},
				};

				console.log("Creating JitsiMeetExternalAPI instance...");
				const api = new window.JitsiMeetExternalAPI(domain, options);

				// Add custom button event listener
				api.addEventListener("toolbarButtonClicked", function (event: any) {
					if (event.key === "custom-leave") {
						if (api) {
							api.dispose();
							window.location.href = "https://collab.datafabdevelopment.com";
						}
					}
				});

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

				api.addEventListener("readyToClose", () => {
					window.location.href = "https://collab.datafabdevelopment.com";
				});

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
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const endMeeting = () => {
		if (jitsiAPI) {
			jitsiAPI.dispose();
			setJitsiAPI(null);
			window.location.href = "https://collab.datafabdevelopment.com";
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
							onClick={() =>
								(window.location.href = "https://collab.datafabdevelopment.com")
							}
							className="bg-blue-600 hover:bg-blue-700"
						>
							Return to Collab
						</Button>
					</div>
				</div>
			) : (
				<div className="fixed inset-0 w-full h-full z-50">
					<div className="fixed left-4 top-4 z-50">
						<img
							src="/LogoLG2.png"
							alt="Company Logo"
							className="h-8 lg:h-12 md:h-12 rounded-lg mt-4"
						/>
					</div>

					<div id="jitsiContainer" className="w-full h-full" />
					<div className="fixed left-4 bottom-0 mb-20 sm:mb-16 md:mb-8 z-50">
						<div className="flex flex-col gap-3">
							{/* <Button
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
							</Button> */}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
