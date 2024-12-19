import { AuthUser } from "./auth.types";
import { Organization, OrgUserResponse } from "./org.types";
import type { AccessStatus, RootBase, UUID } from "./root.types";
import { TaskResponse } from "./task.types";
import { Team } from "./team.types";

// Тип для сутності "Project"
export interface Project extends RootBase {
	title: string; // Назва проекту
	description: string; // Опис проекту
	organizationId?: UUID; // Ідентифікатор організації, до якої належить проект
	organization?: Organization; // Організація, до якої належить проект
	tasks?: TaskResponse[]; // Завдання в рамках проекту
	projectTeams?: ProjectTeam[]; // Зв'язок з командами
	_count?: {
		projectUsers: number;
		projectTeams: number;
		tasks: number;
	};
}

export interface ProjectUsers extends RootBase {
	userId: UUID;
	user: AuthUser;
	projectStatus: AccessStatus;
}

export interface ProjectResponse extends RootBase {
	projectId: UUID;
	projectStatus: AccessStatus;
	project: Project;
	userId: UUID;
	user: {
		organizationUsers: OrgUserResponse[];
	};
}

// Тип для сутності "ProjectTeam"
export interface ProjectTeam extends RootBase {
	projectId: UUID; // Ідентифікатор проекту
	teamId: UUID; // Ідентифікатор команди
	project: Project; // Проект
	team: Team; // Команда
}

export type ProjectFormData = Partial<Omit<Project, "id" | "updatedAt">>;
export type ProjectTeamFormData = Partial<
	Omit<ProjectTeam, "id" | "updatedAt">
>;
