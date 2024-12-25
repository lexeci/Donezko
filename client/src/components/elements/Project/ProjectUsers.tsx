"use client";

import { Button } from "@/components/index";
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
	const { projectUsers, setProjectUsers, handleRefetch } =
		useFetchProjectUsers(projectId); // Залишаємо доступ до даних та рефетч функції
	const { updateStatus } = useUpdateProjectUser();
	const { removeUser } = useRemoveProjectUser();
	const { transferManager } = useTransferProjectManager();

	const handleUpdateArray = (updatedUser: ProjectUsersType) => {
		// Оновлення списку користувачів
		const updatedUsers = projectUsers.map(user =>
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
		updateStatus(
			{
				projectId,
				userId,
				status:
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

	const handleExitProject = (projectId: string, userId: string) => {
		removeUser(
			{
				projectId,
				userId,
			},
			{
				onSuccess: removeUser => {
					const updatedUsers = projectUsers.filter(
						user => user.userId !== removeUser.userId
					);

					setProjectUsers(updatedUsers);
					handleRefetch(); // Викликаємо рефетчінг після видалення користувача
				},
			}
		);
	};

	const handleTransferProject = (projectId: string, userId: string) => {
		transferManager(
			{
				projectId,
				userId,
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
				{projectUsers && projectUsers.length > 0 ? (
					projectUsers.map((userItem, i) => (
						<div
							className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground"
							key={generateKeyComp(`${userItem.user.name}__${i}`)}
						>
							<Person size={48} className="border border-foreground p-0.5" />
							<div className="about flex flex-col justify-start items-start">
								<div className="name">
									<p>Username: {userItem.user.name}</p>
								</div>
								<div className="email">
									<p>Email: "{userItem.user.email}"</p>
								</div>
								<div className="status">
									<p>Status: "{userItem.projectStatus}"</p>
								</div>
								<div className="role">
									<p>Role: "{userItem.role}"</p>
								</div>
							</div>
							<div className="actions flex flex-col gap-y-2 ml-auto">
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
