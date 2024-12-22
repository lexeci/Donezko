/**
 * PermissionType - Defines the types of permissions available for roles in the system.
 *
 * Each role (e.g., OWNER, ADMIN, MEMBER, VIEWER) is granted specific permissions
 * that determine what actions a user can perform in the system.
 *
 * This type is used to restrict or allow access to various system features based on the user's role.
 *
 * The available permissions are:
 * - **createOrganization**: Allows the user to create a new organization.
 * - **updateOrganization**: Allows the user to update an existing organization.
 * - **deleteOrganization**: Allows the user to delete an organization.
 * - **manageUsers**: Allows the user to manage other users within the organization.
 * - **transferOwnership**: Allows the user to transfer ownership of an organization.
 * - **viewResources**: Allows the user to view resources within the organization.
 * - **editResources**: Allows the user to edit resources within the organization.
 * - **removeUser**: Allows the user to remove another user from the organization.
 * - **createProject**: Allows the user to create a new project.
 * - **updateProject**: Allows the user to update an existing project.
 * - **deleteProject**: Allows the user to delete a project.
 * - **createTeam**: Allows the user to create a new team.
 * - **updateTeam**: Allows the user to update an existing team.
 * - **deleteTeam**: Allows the user to delete a team.
 * - **manageTeamUsers**: Allows the user to manage users within a team.
 *
 * This type is useful for checking and enforcing permissions within the application logic.
 */
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
	| 'TransferManagerProject'
	| 'createTeam'
	| 'updateTeam'
	| 'deleteTeam'
	| 'manageTeamUsers';
