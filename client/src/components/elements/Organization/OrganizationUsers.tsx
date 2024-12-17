"use client";

import { Button } from "@/components/index";
import { useUpdateOrgOwner } from "@/src/hooks/organization/useUpdateOrgOwner";
import { useUpdateOrgRole } from "@/src/hooks/organization/useUpdateOrgRole";
import { useUpdateOrgStatus } from "@/src/hooks/organization/useUpdateOrgStatus";
import { OrgRole, OrgUserResponse } from "@/src/types/org.types";
import { AccessStatus } from "@/src/types/root.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react/dist/ssr";

interface OrganizationUsersProps {
	organizationUsers: OrgUserResponse[];
	organizationId: string;
}

export default function OrganizationUsers({
	organizationUsers,
	organizationId,
}: OrganizationUsersProps) {
	const { updateOwner } = useUpdateOrgOwner();
	const { updateRole } = useUpdateOrgRole();
	const { updateStatus } = useUpdateOrgStatus();

	const handleChangeRole = (
		orgUserId: string,
		newRole: OrgRole,
		organizationId: string
	) => {
		updateRole({
			orgUserId,
			id: organizationId,
			role: newRole,
		});
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
										updateStatus({
											id: organizationId,
											orgUserId: userItem.userId,
											organizationStatus:
												userItem.organizationStatus !== "BANNED"
													? ("BANNED" as AccessStatus)
													: ("ACTIVE" as AccessStatus),
										})
									}
								>
									{userItem.organizationStatus !== "BANNED"
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
										handleChangeRole(
											userItem.userId,
											newRole as OrgRole,
											organizationId
										)
									}
								>
									Change Role
								</Button>
								<Button
									type="button"
									modal
									fullWidth
									onClick={() =>
										updateOwner({
											id: organizationId,
											orgUserId: userItem.userId,
										})
									}
								>
									Transfer ownership
								</Button>
							</div>
						</div>
					))
				) : (
					<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
						<h5>You don't have any participants in current organization</h5>
					</div>
				)}
			</div>
		</div>
	);
}
