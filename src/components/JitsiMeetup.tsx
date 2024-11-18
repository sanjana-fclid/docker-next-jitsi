/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";

declare global {
	interface Window {
		JitsiMeetExternalAPI: any;
	}
}

interface JitsiMeetingProps {
	roomName: string;
	userDisplayName?: string;
	onMeetingEnd?: () => void;
}

const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
	roomName,
	userDisplayName = "User",
	onMeetingEnd,
}) => {
	const meetingRef = useRef<HTMLDivElement>(null);
	const apiRef = useRef<any>(null);

	useEffect(() => {
		const loadJitsiScript = () => {
			return new Promise<void>((resolve) => {
				const script = document.createElement("script");
				script.src = `https://localhost:8443/external_api.js`;
				script.async = true;
				script.onload = () => resolve();
				document.body.appendChild(script);
			});
		};

		const initJitsi = async () => {
			if (!window.JitsiMeetExternalAPI) {
				await loadJitsiScript();
			}

			if (!meetingRef.current) return;

			const options = {
				roomName: `${
					process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX || ""
				}${roomName}`,
				width: "100%",
				height: "100%",
				parentNode: meetingRef.current,
				lang: "en",
				userInfo: {
					displayName: userDisplayName,
				},
				configOverwrite: {
					prejoinPageEnabled: false,
					startWithAudioMuted: true,
					startWithVideoMuted: false,
					disableDeepLinking: true,
				},
				interfaceConfigOverwrite: {
					TOOLBAR_BUTTONS: [
						"microphone",
						"camera",
						"closedcaptions",
						"desktop",
						"fullscreen",
						"recording",
						"chat",
						"raisehand",
						"videoquality",
						"filmstrip",
						"tileview",
						"settings",
					],
					SETTINGS_SECTIONS: ["devices", "language", "profile"],
					SHOW_JITSI_WATERMARK: false,
					SHOW_WATERMARK_FOR_GUESTS: false,
					MOBILE_APP_PROMO: false,
				},
			};

			apiRef.current = new window.JitsiMeetExternalAPI(
				process.env.NEXT_PUBLIC_JITSI_DOMAIN!,
				options
			);

			// Event handlers
			apiRef.current.addEventListeners({
				videoConferenceJoined: handleVideoConferenceJoined,
				videoConferenceLeft: handleVideoConferenceLeft,
				participantJoined: handleParticipantJoined,
				participantLeft: handleParticipantLeft,
				readyToClose: handleReadyToClose,
			});
		};

		initJitsi();

		return () => {
			if (apiRef.current) {
				apiRef.current.dispose();
			}
		};
	}, [roomName, userDisplayName]);

	const handleVideoConferenceJoined = () => {
		console.log("Local user joined meeting");
	};

	const handleVideoConferenceLeft = () => {
		console.log("Local user left meeting");
		if (onMeetingEnd) {
			onMeetingEnd();
		}
	};

	const handleParticipantJoined = (participant: any) => {
		console.log("A participant joined:", participant);
	};

	const handleParticipantLeft = (participant: any) => {
		console.log("A participant left:", participant);
	};

	const handleReadyToClose = () => {
		console.log("Meeting is ready to close");
	};

	return (
		<div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
			<div ref={meetingRef} className="absolute inset-0" />
		</div>
	);
};

export default JitsiMeeting;
