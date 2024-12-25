"use client";

import { useFetchOrgUsers } from "@/hooks/organization/useFetchOrgUsers";
import { useAddProjectUser } from "@/hooks/project/useAddProjectUser";
import { OrgUserResponse } from "@/types/org.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react";
import { Button } from "../../ui";

export default function AddProjectUsers({
	organizationId,
	projectId,
}: {
	organizationId: string;
	projectId: string;
}) {
	const { organizationUserList, setOrganizationUserList } = useFetchOrgUsers(
		organizationId,
		projectId,
		true
	);
	const { addUser } = useAddProjectUser();

	const handleUpdateArray = (updatedUser: OrgUserResponse) => {
		if (organizationUserList) {
			// Оновлення списку користувачів
			const updatedUsers = organizationUserList
				? organizationUserList.filter(
						user => user.userId !== updatedUser.userId
				  )
				: [];

			setOrganizationUserList(updatedUsers);
		}
	};

	const handleAddUser = (projectId: string, userId: string) => {
		addUser(
			{
				projectId,
				userId,
			},
			{
				onSuccess: addedUser => handleUpdateArray(addedUser),
			}
		);
	};

	return (
		<div className="container flex flex-col w-full h-full bg-background border border-foreground p-4">
			<div className="title">
				<h5>Users in current organization:</h5>
			</div>
			<div className="users flex flex-col w-full h-full overflow-auto pt-4 gap-y-4">
				{organizationUserList && organizationUserList.length > 0 ? (
					organizationUserList.map((userItem, i) => (
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
									<p>Status: "{userItem.organizationStatus}"</p>
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
									onClick={() => handleAddUser(projectId, userItem.userId)}
								>
									Add user
								</Button>
							</div>
						</div>
					))
				) : (
					<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
						<h5>
							You don't have any participants from organization who haven't been
							in current project yet
						</h5>
					</div>
				)}
			</div>
		</div>
	);
}
