"use client";

import pageStyles from "@/app/page.module.scss";
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
	const { organizationUserList, setOrganizationUserList } = useFetchOrgUsers({
		organizationId,
		projectId,
		hideFromProject: true,
	});
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
		organizationId &&
			addUser(
				{
					projectId,
					userId,
					organizationId,
				},
				{
					onSuccess: addedUser => handleUpdateArray(addedUser),
				}
			);
	};

	return (
		<div className={pageStyles["workspace-user-list"]}>
			<div className={pageStyles["workspace-user-list__title"]}>
				<h5>Users in current organization:</h5>
			</div>
			<div className={pageStyles["workspace-user-list__users"]}>
				{organizationUserList && organizationUserList.length > 0 ? (
					organizationUserList.map((userItem, i) => (
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
									<p>Status: "{userItem.organizationStatus}"</p>
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
									onClick={() => handleAddUser(projectId, userItem.userId)}
								>
									Add user
								</Button>
							</div>
						</div>
					))
				) : (
					<div className={pageStyles["workspace-user-list__not-found"]}>
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
