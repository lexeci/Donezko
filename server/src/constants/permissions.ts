import { OrgRole } from '@prisma/client';
import { PermissionType } from '../types/permissions.types';

export const RolePermissions: Record<OrgRole, PermissionType[]> = {
	[OrgRole.OWNER]: [
		'updateOrganization',
		'deleteOrganization',
		'manageUsers',
		'transferOwnership',
		'viewResources',
		'editResources',
		'createProject',
		'updateProject',
		'deleteProject',
		'createTeam',
		'updateTeam',
		'deleteTeam',
		'removeUser',
		'manageTeamUsers'
	],
	[OrgRole.ADMIN]: [
		'manageUsers',
		'viewResources',
		'editResources',
		'createProject',
		'updateProject',
		'deleteProject',
		'createTeam',
		'updateTeam',
		'deleteTeam',
		'removeUser',
		'manageTeamUsers'
	],
	[OrgRole.MEMBER]: [
		'viewResources',
		'editResources',
		'createTeam',
		'updateTeam',
		'deleteTeam',
		'manageTeamUsers'
	],
	[OrgRole.VIEWER]: ['viewResources']
};
