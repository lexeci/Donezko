import { Button } from "@/src/components/ui";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchOrgUsers } from "@/src/hooks/organization/useFetchOrgUsers";
import { useAddTeamUser } from "@/src/hooks/team/useAddTeamUser";
import { OrgUserResponse } from "@/src/types/org.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ModalWindow from "../../ModalWindow/ModalWindow";

interface AddUserToTeams {
	teamId: string;
	setOpenModalUpdate: (arg: boolean) => void;
	refetch: () => void;
}

export default function AddUserToTeams({
	teamId,
	setOpenModalUpdate,
	refetch,
}: AddUserToTeams) {
	const [organizationUsers, setOrganizationUsers] = useState<
		OrgUserResponse[] | undefined
	>();
	const { organizationId } = useOrganization();
	const { organizationUserList } = useFetchOrgUsers({
		organizationId,
		teamId,
		hideFromTeam: true,
	});

	useEffect(() => {
		setOrganizationUsers(organizationUserList);
	}, [organizationUserList]);

	const { addUserToTeam } = useAddTeamUser();

	const handleAddUser = (teamUserId: string) => {
		if (organizationId)
			addUserToTeam(
				{
					id: teamId,
					teamUserId,
					organizationId,
				},
				{
					onSuccess: data => {
						setOrganizationUsers(
							prevState =>
								prevState &&
								prevState.filter(user => user.userId !== data.userId && user)
						);
						refetch();
					},
				}
			);
	};

	return (
		<ModalWindow
			title="Add user to team.exe"
			subtitle="Add new participant to your team"
			onClose={() => setOpenModalUpdate(false)}
		>
			<div className="container bg-background flex flex-col justify-start items-center p-4 w-full h-full border-4 border-foreground">
				<div className="header flex flex-col w-full py-4 mb-0.5 border-b border-b-foreground">
					<div className="title text-lg font-bold">
						<h4>Add more users to your team</h4>
					</div>
					<div className="text-block">
						<p>
							You can add more users to your team by using the list from
							organization participants
						</p>
					</div>
				</div>
				<div className="container border-t border-foreground mt-0.5 pt-4">
					<div className="users flex flex-col justify-start items-center border border-foreground p-4 w-full h-full overflow-y-auto gap-y-2">
						{organizationUsers ? (
							organizationUsers.length > 0 ? (
								organizationUsers.map((userItem, i) => (
									<div
										className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground"
										key={generateKeyComp(`${userItem.user.name}__${i}`)}
									>
										<Person
											size={48}
											className="border border-foreground p-0.5"
										/>
										<div className="about flex flex-col justify-start items-start">
											<div className="name">
												<p>Username: {userItem.user.name}</p>
											</div>
										</div>
										<div className="actions flex flex-col gap-y-2 ml-auto">
											<Button
												type="button"
												modal
												fullWidth
												onClick={() => handleAddUser(userItem.userId)}
											>
												Add user
											</Button>
										</div>
									</div>
								))
							) : (
								<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
									<h5>
										You don't have any participants in current organization
									</h5>
								</div>
							)
						) : (
							<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
								<h5>You don't have any participants in current organization</h5>
							</div>
						)}
					</div>
				</div>
			</div>
		</ModalWindow>
	);
}
