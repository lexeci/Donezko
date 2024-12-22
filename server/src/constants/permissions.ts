import { OrgRole } from '@prisma/client'; // Importing the OrgRole enumeration from Prisma
import { PermissionType } from '../types/permissions.types'; // Importing the PermissionType type

// A mapping of organization roles to their respective permissions
export const RolePermissions: Record<OrgRole, PermissionType[]> = {
	// Permissions for the OrgRole.OWNER role
	[OrgRole.OWNER]: [
		'updateOrganization', // Can update organization details
		'deleteOrganization', // Can delete the organization
		'transferOwnership', // Can transfer ownership of the organization
		'manageUsers', // Can manage users (add, remove, modify roles)
		'viewResources', // Can view resources
		'editResources', // Can edit resources
		'createProject', // Can create new projects
		'updateProject', // Can update existing projects
		'deleteProject', // Can delete projects
		'TransferManagerProject', // Can transfer managers projects
		'createTeam', // Can create new teams
		'updateTeam', // Can update team details
		'deleteTeam', // Can delete teams
		'removeUser', // Can remove users from the organization or team
		'manageTeamUsers' // Can manage team users (add/remove from teams)
	],

	// Permissions for the OrgRole.ADMIN role
	[OrgRole.ADMIN]: [
		'manageUsers', // Can manage users
		'viewResources', // Can view resources
		'editResources', // Can edit resources
		'createProject', // Can create new projects
		'updateProject', // Can update projects
		'deleteProject', // Can delete projects
		'TransferManagerProject', // Can transfer managers projects
		'createTeam', // Can create teams
		'updateTeam', // Can update teams
		'deleteTeam', // Can delete teams
		'removeUser', // Can remove users
		'manageTeamUsers' // Can manage team users
	],

	// Permissions for the 'MEMBER' role
	[OrgRole.MEMBER]: [
		'viewResources', // Can view resources
		'editResources', // Can edit resources
		'createTeam', // Can create teams
		'updateTeam', // Can update teams
		'deleteTeam', // Can delete teams
		'manageTeamUsers' // Can manage team users
	],

	// Permissions for the 'VIEWER' role
	[OrgRole.VIEWER]: [
		'viewResources' // Can view resources
	]
};
