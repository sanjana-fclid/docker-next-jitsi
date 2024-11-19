export interface Feature {
	icon: React.ReactNode;
	title: string;
	description: string;
	gradient: string;
}

export interface User {
	user_metadata?: {
		name?: string;
		avatar_url?: string;
	};
}
