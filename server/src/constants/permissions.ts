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
		'removeUser'
	],
	[OrgRole.ADMIN]: [
		'manageUsers',
		'viewResources',
		'editResources',
		'createProject',
		'updateProject',
		'deleteProject',
		'removeUser'
	],
	[OrgRole.MEMBER]: ['viewResources', 'editResources'],
	[OrgRole.VIEWER]: ['viewResources']
};
