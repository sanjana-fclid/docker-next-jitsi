/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/jitsi.d.ts
declare namespace JitsiMeetExternalAPI {
	interface ConfigOverwrite {
		prejoinPageEnabled?: boolean;
		startWithAudioMuted?: boolean;
		startWithVideoMuted?: boolean;
		disableRemoteMute?: boolean;
		disableRemoteRaiseHand?: boolean;
		remoteVideoMenu?: {
			disableKick?: boolean;
			disableGrantModerator?: boolean;
			disablePrivateChat?: boolean;
		};
		disableProfile?: boolean;
		participantsPane?: {
			enabled?: boolean;
			hideModeratorSettings?: boolean;
			hideMoreActionsButton?: boolean;
			hideMuteAllButton?: boolean;
		};
		moderator?: {
			enabled?: boolean;
			skipGrantModerator?: boolean;
		};
		watermark?: {
			enabled?: boolean;
			logo?: string;
			link?: string;
		};
		disableDeepLinking?: boolean;
		lobby?: {
			enabled?: boolean;
			autoKnock?: boolean;
		};
		enableLobbyChat?: boolean;
		requireDisplayName?: boolean;
		enableClosePage?: boolean;
		enableInsecureRoomNameWarning?: boolean;
	}

	interface InterfaceConfigOverwrite {
		TOOLBAR_BUTTONS?: string[];
		[key: string]: any;
	}

	interface Options {
		roomName: string;
		width: string | number;
		height: string | number;
		parentNode: Element | null;
		configOverwrite?: ConfigOverwrite;
		interfaceConfigOverwrite?: InterfaceConfigOverwrite;
	}

	interface ParticipantKnockingEvent {
		participant: {
			id: string;
			name?: string;
		};
	}

	interface ConnectionFailedEvent {
		error: string;
	}
}

declare class JitsiMeetExternalAPI {
	constructor(domain: string, options: JitsiMeetExternalAPI.Options);

	addEventListener(
		event: "participantKnocking",
		callback: (data: JitsiMeetExternalAPI.ParticipantKnockingEvent) => void
	): void;
	addEventListener(
		event: "connectionFailed",
		callback: (data: JitsiMeetExternalAPI.ConnectionFailedEvent) => void
	): void;
	addEventListener(
		event: "videoConferenceJoined",
		callback: (data: any) => void
	): void;
	addEventListener(
		event: "lobby.participant-access-granted",
		callback: (data: any) => void
	): void;
	addEventListener(
		event: "lobby.participant-access-denied",
		callback: (data: any) => void
	): void;
	addEventListener(event: string, callback: (data: any) => void): void;

	removeEventListener(event: string): void;
	dispose(): void;
	executeCommand(command: string, ...args: any[]): void;
	getParticipantsInfo(): any[];
	getVideoQuality(): number;
	isAudioMuted(): boolean;
	isVideoMuted(): boolean;
}

declare global {
	interface Window {
		JitsiMeetExternalAPI: typeof JitsiMeetExternalAPI;
	}
}

export {};
