import {AuthUser} from "./auth.types";
import {Organization} from "./org.types";
import {ProjectTeam} from "./project.types";
import {AccessStatus, RootBase, UUID} from "./root.types";
import {TaskResponse} from "./task.types";

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

export type ManageTeamUser = {
    id: UUID;
    userId?: UUID;
    teamStatus?: AccessStatus;
    role?: TeamRole;
    organizationId?: UUID;
    projectId?: UUID;
    teamUserId?: UUID;
};

export interface TeamUsersResponse extends RootBase {
    role: TeamRole;
    teamId: string;
    teamStatus?: AccessStatus;
    user: AuthUser;
    userId: string;
}

export interface Team extends RootBase {
    title: string;
    description: string;
    organizationId: UUID;
    organization: Organization;
    projectId: UUID;
    tasks: TaskResponse[];
    teamUsers?: Array<{
        userid: UUID;
        id: UUID;
        role: TeamRole;
        teamStatus: AccessStatus;
        user: {
            id: UUID;
            name: string;
            email: string;
        };
    }>;
    projectTeams: ProjectTeam[];
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

type TeamLeaderId = { teamLeaderId: string };

export type TeamFormData = Partial<
    Omit<Team, "id" | "updatedAt" | "updatedAt"> & TeamLeaderId
>;
