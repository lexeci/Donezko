"use client";

import { Button, ModalWindow } from "@/components/index";
import { useUpdateOrgOwner } from "@/hooks/organization/useUpdateOrgOwner";
import { useUpdateOrgRole } from "@/hooks/organization/useUpdateOrgRole";
import { useUpdateOrgStatus } from "@/hooks/organization/useUpdateOrgStatus";
import { OrgRole, OrgUserResponse } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person, UserSwitch } from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction, useState } from "react";

interface OrganizationUsersProps {
	organizationUsers: OrgUserResponse[];
	organizationId: string;
	setOrganizationUsers: Dispatch<SetStateAction<OrgUserResponse[] | undefined>>;
	administrateRole: OrgRole;
}

export default function OrganizationUsers({
	organizationUsers,
	organizationId,
	setOrganizationUsers,
	administrateRole,
}: OrganizationUsersProps) {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [newOwnerId, setNewOwnerId] = useState<string>();

	const { updateOwner } = useUpdateOrgOwner();
	const { updateRole } = useUpdateOrgRole();
	const { updateStatus } = useUpdateOrgStatus();

	const handleUpdateArray = (updatedUser: OrgUserResponse) => {
		// Оновлення списку користувачів
		const updatedUsers = organizationUsers.map(user =>
			user.userId === updatedUser.userId
				? {
						...user,
						role: updatedUser.role,
						organizationStatus: updatedUser.organizationStatus,
				  }
				: user
		);
		setOrganizationUsers(updatedUsers);
	};

	const handleChangeRole = (orgUserId: string, newRole: OrgRole) => {
		updateRole(
			{
				orgUserId,
				id: organizationId,
				role: newRole,
			},
			{
				onSuccess: updatedUser => handleUpdateArray(updatedUser),
			}
		);
	};

	const handleChangeStatus = (
		orgUserId: string,
		organizationStatus: AccessStatus
	) => {
		updateStatus(
			{
				id: organizationId,
				orgUserId,
				organizationStatus:
					organizationStatus !== AccessStatus.BANNED
						? AccessStatus.BANNED
						: AccessStatus.ACTIVE,
			},
			{
				onSuccess: updatedUser => handleUpdateArray(updatedUser),
			}
		);
	};

	const handleTransferOwner = (orgUserId: string) => {
		setOpenModal(true);
		setNewOwnerId(orgUserId);
	};

	const transferOwner = () => {
		newOwnerId &&
			updateOwner(
				{
					id: organizationId,
					orgUserId: newOwnerId,
				},
				{
					onSuccess: updatedUser => {
						handleUpdateArray(updatedUser);
						setOpenModal(false);
						window.location.reload(); // I don't like it either
					},
				}
			);
	};

	return (
		<div className="container flex flex-col w-full h-full bg-background border border-foreground p-4">
			<div className="title">
				<h5>Users in current organization:</h5>
			</div>
			<div className="users flex flex-col w-full h-full overflow-auto pt-4 gap-y-4">
				{organizationUsers.length > 0 ? (
					organizationUsers.map((userItem, i) => (
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
								<div className="tasks">
									<p>Tasks: "{userItem.user?._count?.tasks}"</p>
								</div>
							</div>
							<div className="actions flex flex-col gap-y-2 ml-auto">
								<Button
									type="button"
									modal
									fullWidth
									onClick={() =>
										handleChangeStatus(
											userItem.userId,
											userItem.organizationStatus
										)
									}
								>
									{userItem.organizationStatus !== AccessStatus.BANNED
										? "Ban"
										: "Remove Ban"}
								</Button>
								<Button
									type="button"
									modal
									fullWidth
									selectable
									selectableArray={[
										{ text: "Admin" },
										{ text: "Member" },
										{ text: "Viewer" },
									]}
									selectableOnClick={(newRole: string) =>
										handleChangeRole(userItem.userId, newRole as OrgRole)
									}
								>
									Change Role
								</Button>
								{administrateRole === "OWNER" && (
									<Button
										type="button"
										modal
										fullWidth
										onClick={() => handleTransferOwner(userItem.userId)}
									>
										Transfer ownership
									</Button>
								)}
							</div>
						</div>
					))
				) : (
					<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
						<h5>You don't have any participants in current organization</h5>
					</div>
				)}
			</div>

			{openModal && (
				<ModalWindow
					title="Program to ask of sure action.exe"
					subtitle="Hey do you really know what you are doing ?"
					onClose={() => setOpenModal(false)}
				>
					<div className="container bg-background flex flex-col justify-center items-center p-4 gap-y-8 w-auto h-auto">
						<div className="desc max-w-80 flex flex-col justify-center items-center text-center gap-y-2">
							<h1 className="font-bold text-lg">Hey did you know?</h1>
							<p>
								If you proceed on this action you will be no longer an owner to
								this organization. Which means you remove all your privileges.
								Make sure that you understand that.
							</p>
						</div>
						<div className="w-full h-full flex justify-center items-center">
							<Button type="button" onClick={() => transferOwner()}>
								<UserSwitch size={22} className="mr-4" /> Transfer
							</Button>
						</div>
					</div>
				</ModalWindow>
			)}
		</div>
	);
}
