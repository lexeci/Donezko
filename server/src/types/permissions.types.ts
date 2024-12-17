// Тип дозволів для кожної ролі
export type PermissionType =
	| 'createOrganization'
	| 'updateOrganization'
	| 'deleteOrganization'
	| 'manageUsers'
	| 'transferOwnership'
	| 'viewResources'
	| 'editResources'
	| 'removeUser'
	| 'createProject'
	| 'updateProject'
	| 'deleteProject'
	| 'createTeam'
	| 'updateTeam'
	| 'deleteTeam'
	| 'manageTeamUsers';
