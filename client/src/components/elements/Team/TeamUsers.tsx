"use client";

import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchUsersTeam } from "@/hooks/team/useFetchUsersTeam";
import { useUpdateTeamStatus } from "@/hooks/team/useUpdateTeamStatus";
import { useRemoveUserFromTeam } from "@/src/hooks/team/useRemoveUserFromTeam";
import { useTransferLeadership } from "@/src/hooks/team/useTransferLeadership";
import { OrgRole } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import { TeamRole, TeamUsersResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react/dist/ssr";

export default function TeamUsers({
	teamId,
	orgRole,
	role,
}: {
	teamId: string;
	orgRole?: OrgRole;
	role?: TeamRole;
}) {
	const { organizationId } = useOrganization();
	const { teamUsers, setTeamUsers, handleRefetch } = useFetchUsersTeam({
		organizationId,
		id: teamId,
	}); // Залишаємо доступ до даних та рефетч функції

	console.log(teamUsers);

	const { updateStatus } = useUpdateTeamStatus();
	// const {addUser} = useAddTeamUser()
	const { removeUser } = useRemoveUserFromTeam();
	const { transferLeadership } = useTransferLeadership();

	const hasPermission = orgRole === OrgRole.ADMIN || orgRole === OrgRole.OWNER;
	const isLeader = role === TeamRole.LEADER;

	const handleUpdateArray = (updatedUser: TeamUsersResponse) => {
		if (teamUsers) {
			// Оновлення списку користувачів
			const updatedUsers = teamUsers.map(user =>
				user.userId === updatedUser.userId
					? {
							...user,
							teamStatus: updatedUser.teamStatus,
							role: updatedUser.role,
					  }
					: user
			);

			setTeamUsers(updatedUsers);
		}
	};

	const handleChangeStatus = (userId: string, projectStatus: AccessStatus) => {
		updateStatus(
			{
				id: teamId,
				userId,
				teamStatus:
					projectStatus !== AccessStatus.BANNED
						? AccessStatus.BANNED
						: AccessStatus.ACTIVE,
			},
			{
				onSuccess: updatedUser => {
					handleUpdateArray(updatedUser);
					handleRefetch(); // Викликаємо рефетчінг після оновлення статусу
				},
			}
		);
	};

	const handleRemoveUser = (teamId: string, userId: string) => {
		removeUser(
			{
				id: teamId,
				teamUserId: userId,
			},
			{
				onSuccess: removeUser => {
					if (teamUsers) {
						const updatedUsers = teamUsers.filter(
							user => user.userId !== removeUser.userId
						);

						setTeamUsers(updatedUsers);
						handleRefetch(); // Викликаємо рефетчінг після видалення користувача
					}
				},
			}
		);
	};

	const handleTransferLeader = (teamId: string, userId: string) => {
		transferLeadership(
			{
				id: teamId,
				teamUserId: userId,
			},
			{
				onSuccess: updatedUser => {
					handleUpdateArray(updatedUser);
					handleRefetch(); // Викликаємо рефетчінг після передачі ролі
				},
			}
		);
	};

	return (
		<div className="container flex flex-col w-full h-full bg-background border border-foreground p-4">
			<div className="title">
				<h5>Users in current project:</h5>
			</div>
			<div className="users flex flex-col w-full h-full overflow-auto pt-4 gap-y-4">
				{teamUsers && teamUsers.length > 0 ? (
					teamUsers.map((userItem, i) => (
						<div
							className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground"
							key={generateKeyComp(`${userItem.user.name}__${i}`)}
						>
							<Person size={48} className="border border-foreground p-0.5" />
							<div className="about flex flex-col justify-start items-start">
								<div className="name">
									<p>Username: {userItem.user.name}</p>
								</div>
								{userItem.user.email && (
									<div className="email">
										<p>Email: "{userItem.user.email}"</p>
									</div>
								)}
								{userItem.teamStatus && (
									<div className="status">
										<p>Status: "{userItem.teamStatus}"</p>
									</div>
								)}
								<div className="role">
									<p>Role: "{userItem.role}"</p>
								</div>
							</div>
							<div className="actions flex flex-col gap-y-2 ml-auto">
								{(isLeader || hasPermission) && userItem?.teamStatus && (
									<Button
										type="button"
										modal
										fullWidth
										onClick={() =>
											handleChangeStatus(
												userItem.userId,
												userItem.teamStatus as AccessStatus
											)
										}
									>
										{userItem.teamStatus === AccessStatus.BANNED
											? "Remove Ban"
											: "Ban from Team"}
									</Button>
								)}
								{hasPermission && (
									<Button
										type="button"
										modal
										fullWidth
										onClick={() => handleRemoveUser(teamId, userItem.userId)}
									>
										Remove from Project
									</Button>
								)}
								{(isLeader || hasPermission) && (
									<Button
										type="button"
										modal
										fullWidth
										onClick={() =>
											handleTransferLeader(teamId, userItem.userId)
										}
									>
										Transfer Manager Role
									</Button>
								)}
							</div>
						</div>
					))
				) : (
					<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
						<h5>
							You don't have any participants from organization in current
							project
						</h5>
					</div>
				)}
			</div>
		</div>
	);
}
