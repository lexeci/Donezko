import { AuthUser, UserFormType } from "@/types/auth.types";
import { axiosWithAuth } from "@/api/interceptors";

export interface ProfileResponse {
	user: AuthUser;
	statistics: {
		label: string;
		value: string;
	}[];
}

class UserService {
	private BASE_URL = "/user/profile";

	/**
	 * Fetches the user profile data.
	 * @returns {Promise<AuthUser>} The user profile data.
	 */
	async getProfile(): Promise<ProfileResponse> {
		try {
			const response = await axiosWithAuth.get<ProfileResponse>(this.BASE_URL);
			return response.data; // Return only the user part of the response
		} catch (error) {
			console.error("Error fetching user profile:", error);
			throw new Error("Could not fetch user profile"); // Handle error appropriately
		}
	}

	/**
	 * Updates the user profile with new data.
	 * @param {UserFormType} data - The user data to update.
	 * @returns {Promise<AuthUser>} The updated user profile data.
	 */
	async update(data: UserFormType): Promise<AuthUser> {
		try {
			const response = await axiosWithAuth.put<ProfileResponse>(this.BASE_URL, data);
			return response.data.user; // Return only the updated user part of the response
		} catch (error) {
			console.error("Error updating user profile:", error);
			throw new Error("Could not update user profile"); // Handle error appropriately
		}
	}
}

export const userService = new UserService();
