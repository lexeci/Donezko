import { Organization } from "./org.types";
import { AccessStatus, RootBase, UUID } from "./root.types";
import { TaskResponse } from "./task.types";

export enum TeamRole {
	LEADER = "LEADER",
	MEMBER = "MEMBER",
}

interface teamUser {
	id: UUID;
	role: TeamRole;
	teamStatus: AccessStatus;
	user: {
		id: UUID;
		name: string;
		email: string;
	};
}

export interface Team extends RootBase {
	title: string;
	description: string;
	organizationId: UUID;
	organization: Organization;
	projectId: UUID;
	tasks: TaskResponse[];
	teamUsers?: Array<{
		id: UUID;
		role: TeamRole;
		teamStatus: AccessStatus;
		user: {
			id: UUID;
			name: string;
			email: string;
		};
	}>;
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
	teamUsers: teamUser[];
	_count: {
		teamUsers: true;
		tasks: true;
	};
}

export interface TeamsProjectResponse {
	inProject: TeamsResponse[];
	notInProject: TeamsResponse[];
}

export interface TeamWithUsersResponse extends TeamResponse {
	teamUsers: teamUser[];
}

export interface ManageTeamData {
	organizationId: UUID;
	projectId: UUID;
	teamUserId: UUID;
}

type TeamLeaderId = { teamLeaderId: string };

export type TeamFormData = Partial<
	Omit<Team, "id" | "updatedAt" | "updatedAt"> & TeamLeaderId
>;
