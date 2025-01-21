"use client";

import pageStyles from "@/app/page.module.scss";
import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchProjectUsers } from "@/hooks/project/useFetchProjectUser";
import { useRemoveProjectUser } from "@/hooks/project/useRemoveProjectUser";
import { useTransferProjectManager } from "@/hooks/project/useTransferProjectManager";
import { useUpdateProjectUser } from "@/hooks/project/useUpdateProjectUser";
import { OrgRole } from "@/types/org.types";
import { ProjectUsers as ProjectUsersType } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react";

export default function ProjectUsers({
	projectId,
	role,
}: {
	projectId: string;
	role?: OrgRole;
}) {
	const { organizationId } = useOrganization();
	const { projectUsers, setProjectUsers, handleRefetch } = useFetchProjectUsers(
		projectId,
		organizationId
	); // Залишаємо доступ до даних та рефетч функції
	const { updateStatus } = useUpdateProjectUser();
	const { removeUser } = useRemoveProjectUser();
	const { transferManager } = useTransferProjectManager();

	const handleUpdateArray = (updatedUser: ProjectUsersType) => {
		// Оновлення списку користувачів
		const updatedUsers = projectUsers?.map(user =>
			user.userId === updatedUser.userId
				? {
						...user,
						projectStatus: updatedUser.projectStatus,
				  }
				: user
		);

		setProjectUsers(updatedUsers);
	};

	const handleChangeStatus = (userId: string, projectStatus: AccessStatus) => {
		organizationId &&
			updateStatus(
				{
					projectId,
					userId,
					status:
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

	const handleExitProject = (projectId: string, userId: string) => {
		organizationId &&
			removeUser(
				{
					projectId,
					userId,
					organizationId,
				},
				{
					onSuccess: removeUser => {
						const updatedUsers = projectUsers?.filter(
							user => user.userId !== removeUser.userId
						);

						setProjectUsers(updatedUsers);
						handleRefetch(); // Викликаємо рефетчінг після видалення користувача
					},
				}
			);
	};

	const handleTransferProject = (projectId: string, userId: string) => {
		organizationId &&
			transferManager(
				{
					projectId,
					userId,
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
			<div className={pageStyles["workspace-user-list__title"]}>
				<h5>Users in current project:</h5>
			</div>
			<div className={pageStyles["workspace-user-list__users"]}>
				{projectUsers && projectUsers.length > 0 ? (
					projectUsers.map((userItem, i) => (
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
								<div
									className={
										pageStyles["workspace-user-list__users__item__email"]
									}
								>
									<p>Email: "{userItem.user.email}"</p>
								</div>
								<div
									className={
										pageStyles["workspace-user-list__users__item__status"]
									}
								>
									<p>Status: "{userItem.projectStatus}"</p>
								</div>
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
								<Button
									type="button"
									modal
									fullWidth
									onClick={() =>
										handleChangeStatus(userItem.userId, userItem.projectStatus)
									}
								>
									{userItem.projectStatus === AccessStatus.BANNED
										? "Remove Ban"
										: "Ban from Project"}
								</Button>
								{role && (role === OrgRole.ADMIN || role === OrgRole.OWNER) && (
									<Button
										type="button"
										modal
										fullWidth
										onClick={() =>
											handleExitProject(projectId, userItem.userId)
										}
									>
										Remove from Project
									</Button>
								)}
								{role && (role === OrgRole.ADMIN || role === OrgRole.OWNER) && (
									<Button
										type="button"
										modal
										fullWidth
										onClick={() =>
											handleTransferProject(projectId, userItem.userId)
										}
									>
										Transfer Manager Role
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
		</div>
	);
}
