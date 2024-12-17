import { AccessStatus, RootBase, UUID } from "./root.types";
import { TaskResponse } from "./task.types";

export enum TeamRole {
	LEADER = "LEADER",
	MEMBER = "MEMBER",
}

export interface TeamResponse extends RootBase {
	title: string;
	description: string;
	organizationId: UUID;
	organization: {
		title: string;
	};
	projectId: UUID;
	tasks: TaskResponse[];
}

export interface TeamWithUsersResponse extends TeamResponse {
	teamUsers: Array<{
		id: UUID;
		role: TeamRole;
		teamStatus: AccessStatus;
		user: {
			id: UUID;
			name: string;
			email: string;
		};
	}>;
}

export interface ManageTeamData {
	organizationId: UUID;
	projectId: UUID;
	teamUserId: UUID;
}

export type TeamFormData = Partial<Omit<TeamResponse, "id" | "updatedAt">>;
