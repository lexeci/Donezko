"use client";

import { Button } from "@/components/index";
import { useFetchProjectUsers } from "@/src/hooks/project/useFetchProjectUser";
import { useUpdateProjectUser } from "@/src/hooks/project/useUpdateProjectUser";
import { ProjectUsers as ProjectUsersType } from "@/src/types/project.types";
import { AccessStatus } from "@/src/types/root.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react";

export default function ProjectUsers({ projectId }: { projectId: string }) {
	const { projectUsers, setProjectUsers } = useFetchProjectUsers(projectId);
	const { updateStatus } = useUpdateProjectUser();

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
					projectStatus !== "BANNED"
						? ("BANNED" as AccessStatus)
						: ("ACTIVE" as AccessStatus),
			},
			{
				onSuccess: updatedUser => handleUpdateArray(updatedUser),
			}
		);
	};

	return (
		<div className="container flex flex-col w-full h-full bg-background border border-foreground p-4">
			<div className="title">
				<h5>Users in current organization:</h5>
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
									{userItem.projectStatus === "BANNED"
										? "Remove Ban"
										: "Ban from Project"}
								</Button>
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
