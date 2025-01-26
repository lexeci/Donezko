"use client";

import pageStyles from "@/app/page.module.scss";
import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchUsersTeam } from "@/hooks/team/useFetchUsersTeam";
import { useRemoveUserFromTeam } from "@/hooks/team/useRemoveUserFromTeam";
import { useTransferLeadership } from "@/hooks/team/useTransferLeadership";
import { useUpdateTeamStatus } from "@/hooks/team/useUpdateTeamStatus";
import { OrgRole } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import { TeamRole, TeamUsersResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import AddUserToTeams from "./OperateElements/AddUserToTeams";

export default function TeamUsers({
	teamId,
	orgRole,
	role,
}: {
	teamId: string;
	orgRole?: OrgRole;
	role?: TeamRole;
}) {
	const [showModal, setShowModal] = useState<boolean>(false);

	const { organizationId } = useOrganization();
	const { teamUsers, setTeamUsers, handleRefetch } = useFetchUsersTeam({
		organizationId,
		id: teamId,
	}); // Залишаємо доступ до даних та рефетч функції

	const { updateStatus } = useUpdateTeamStatus();
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
		if (organizationId)
			updateStatus(
				{
					id: teamId,
					teamUserId: userId,
					teamStatus:
						projectStatus !== AccessStatus.BANNED
							? AccessStatus.BANNED
							: AccessStatus.ACTIVE,
					organizationId,
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
		if (organizationId)
			removeUser(
				{
					id: teamId,
					teamUserId: userId,
					organizationId,
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
		if (organizationId)
			transferLeadership(
				{
					id: teamId,
					teamUserId: userId,
					organizationId,
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
		<div className={pageStyles["workspace-user-list"]}>
			<div className={pageStyles["workspace-user-list__header"]}>
				<div className={pageStyles["workspace-user-list__title"]}>
					<h5>Users in current project:</h5>
				</div>
				<div className={pageStyles["workspace-user-list__header__button"]}>
					<Button
						type="button"
						modal
						fullWidth
						onClick={() => setShowModal(true)}
					>
						Connect more Users
					</Button>
				</div>
			</div>
			<div className={pageStyles["workspace-user-list__users"]}>
				{teamUsers && teamUsers.length > 0 ? (
					teamUsers.map((userItem, i) => (
						<div
							className={pageStyles["workspace-user-list__users__item"]}
							key={generateKeyComp(`${userItem.user.name}__${i}`)}
						>
							<Person
								size={48}
								className={pageStyles["workspace-user-list__users__item__ico"]}
							/>
							<div
								className={
									pageStyles["workspace-user-list__users__item__about"]
								}
							>
								<div
									className={
										pageStyles["workspace-user-list__users__item__name"]
									}
								>
									<p>Username: {userItem.user.name}</p>
								</div>
								{userItem.user.email && (
									<div
										className={
											pageStyles["workspace-user-list__users__item__email"]
										}
									>
										<p>Email: "{userItem.user.email}"</p>
									</div>
								)}
								{userItem.teamStatus && (
									<div
										className={
											pageStyles["workspace-user-list__users__item__status"]
										}
									>
										<p>Status: "{userItem.teamStatus}"</p>
									</div>
								)}
								<div
									className={
										pageStyles["workspace-user-list__users__item__role"]
									}
								>
									<p>Role: "{userItem.role}"</p>
								</div>
							</div>
							<div
								className={
									pageStyles["workspace-user-list__users__item__actions"]
								}
							>
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
										Remove from Team
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
										Transfer Leader Role
									</Button>
								)}
							</div>
						</div>
					))
				) : (
					<div className={pageStyles["workspace-user-list__not-found"]}>
						<h5>
							You don't have any participants from organization in current
							project
						</h5>
					</div>
				)}
			</div>
			{showModal && (
				<AddUserToTeams
					teamId={teamId}
					setOpenModalUpdate={setShowModal}
					refetch={handleRefetch}
				/>
			)}
		</div>
	);
}
