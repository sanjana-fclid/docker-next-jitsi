import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/auth-helpers-nextjs";

export class UserService {
	private supabase;

	constructor() {
		this.supabase = createClientComponentClient();
	}

	/**
	 * Get the currently authenticated user
	 */
	async getUser(): Promise<User | null> {
		try {
			const {
				data: { user },
				error,
			} = await this.supabase.auth.getUser();
			if (error) throw error;
			return user;
		} catch (error) {
			console.error("Error fetching user:", error);
			throw error;
		}
	}

	/**
	 * Subscribe to auth state changes
	 */
	onAuthStateChange(callback: (user: User | null) => void) {
		const {
			data: { subscription },
		} = this.supabase.auth.onAuthStateChange((_event, session) => {
			callback(session?.user ?? null);
		});

		return subscription;
	}

	/**
	 * Sign out the current user
	 */
	async signOut(): Promise<void> {
		try {
			const { error } = await this.supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Error signing out:", error);
			throw error;
		}
	}

	/**
	 * Update user metadata
	 */
	async updateUserMetadata(metadata: {
		name?: string;
		avatar_url?: string;
	}): Promise<User | null> {
		try {
			const {
				data: { user },
				error,
			} = await this.supabase.auth.updateUser({
				data: metadata,
			});

			if (error) throw error;
			return user;
		} catch (error) {
			console.error("Error updating user metadata:", error);
			throw error;
		}
	}

	/**
	 * Get user session
	 */
	async getSession() {
		try {
			const {
				data: { session },
				error,
			} = await this.supabase.auth.getSession();
			if (error) throw error;
			return session;
		} catch (error) {
			console.error("Error getting session:", error);
			throw error;
		}
	}

	/**
	 * Upload avatar image
	 */
	async uploadAvatar(file: File): Promise<string> {
		try {
			const user = await this.getUser();
			if (!user) throw new Error("No user authenticated");

			const fileExt = file.name.split(".").pop();
			const fileName = `${user.id}-${Math.random()}.${fileExt}`;
			const filePath = `avatars/${fileName}`;

			const { error: uploadError } = await this.supabase.storage
				.from("avatars")
				.upload(filePath, file);

			if (uploadError) throw uploadError;

			const {
				data: { publicUrl },
			} = this.supabase.storage.from("avatars").getPublicUrl(filePath);

			// Update user metadata with new avatar URL
			await this.updateUserMetadata({ avatar_url: publicUrl });

			return publicUrl;
		} catch (error) {
			console.error("Error uploading avatar:", error);
			throw error;
		}
	}
}

// Export a singleton instance
export const userService = new UserService();
