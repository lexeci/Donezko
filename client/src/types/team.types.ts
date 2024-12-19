import { Organization } from "./org.types";
import { AccessStatus, RootBase, UUID } from "./root.types";
import { TaskResponse } from "./task.types";

export enum TeamRole {
	LEADER = "LEADER",
	MEMBER = "MEMBER",
}

interface Team extends RootBase {
	title: string;
	description: string;
	organizationId: UUID;
	organization: Organization;
	projectId: UUID;
	tasks: TaskResponse[];
	_count?: {
		teamUsers: number;
		tasks: number;
	};
}

export interface TeamResponse extends RootBase {
	teamId: string;
	role: TeamRole;
	teamStatus: AccessStatus;
	team: Team;
}

export interface TeamsResponse extends RootBase {
	title: string;
	description: string;
	organizationId: string;
	_count: {
		teamUsers: true;
		tasks: true;
	};
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

export type TeamFormData = Partial<
	Omit<Team, "id" | "updatedAt" | "updatedAt">
>;
