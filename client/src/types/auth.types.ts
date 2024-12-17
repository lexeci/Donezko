export interface AuthForm {
	email: string;
	password: string;
}

export interface AuthUser {
	id: number;
	name?: string;
	email: string;

	workInterval?: number;
	breakInterval?: number;
	intervalsCount?: number;
}

export interface AuthResponse {
	accessToken: string;
	user: AuthUser;
}

export type TypeUserForm = Omit<AuthUser, "id"> & { password?: string };
