import {AuthUser} from "./auth.types";
import {Project} from "./project.types";
import type {AccessStatus, RootBase, UUID} from "./root.types";
import {TaskResponse} from "./task.types";
import {TeamsResponse} from "./team.types";

// Перелічення для ролей в організації
export enum OrgRole {
    OWNER = "OWNER", // Власник організації
    ADMIN = "ADMIN", // Адміністратор організації
    MEMBER = "MEMBER", // Член організації
    VIEWER = "VIEWER", // Переглядач організації
}

export type JoinOrgType = {
    title: string;
    joinCode: string;
};

export type ManageOrgUser = {
    id: string;
    orgUserId: string;
    role?: OrgRole;
    organizationStatus?: AccessStatus;
};

export interface Organization extends RootBase {
    title: string; // Назва організації
    description?: string; // Опис організації
    joinCode?: string; // Код для приєднання до організації (опційно)
    organizationUsers?: OrgUserResponse[]; // Користувачі організації
    projects?: Project[]; // Проекти в межах організації
    teams?: TeamsResponse[]; // Команди, що належать організації
    tasks?: TaskResponse[];
    _count?: {
        organizationUsers: number;
        teams: number;
        projects: number;
    };
}

// Тип для сутності "Organization"
export interface OrgResponse {
    organization: Organization;
    role?: OrgRole;
    organizationStatus?: AccessStatus;
}

// Тип для сутності "OrganizationUser"
export interface OrgUserResponse extends RootBase {
    userId: UUID; // Ідентифікатор користувача
    organizationId: UUID; // Ідентифікатор організації
    organizationStatus: AccessStatus; // Статус користувача в організації (наприклад, ACTIVE або BANNED)
    role: OrgRole; // Роль користувача в організації (OWNER, ADMIN, MEMBER, VIEWER)
    user: AuthUser; // Користувач
    organization: Organization; // Організація
}

export type OrgFormData = Partial<Omit<Organization, "id" | "updatedAt">>;
export type OrgUserFormData = Partial<
    Omit<OrgUserResponse, "id" | "updatedAt">
>;
