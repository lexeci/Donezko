"use client";

import pageStyles from "@/app/page.module.scss";
import { useOrganization } from "@/context/OrganizationContext";
import { useDeleteOrg } from "@/hooks/organization/useDeleteOrg";
import { useFetchOrgById } from "@/hooks/organization/useFetchOrgById";
import {
	Button,
	LackPermission,
	ModalWindow,
	OrganizationUpdate,
	OrganizationUsers,
	PageHeader,
	PageLayout,
	ProjectElements,
	TeamElements,
	WindowContainer,
} from "@/src/components";
import { OrgRole, OrgUserResponse } from "@/types/org.types";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Organization() {
	const { replace } = useRouter();
	const { organizationId: cookieOrgId, saveOrganization } = useOrganization();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

	const params = useParams<{ id: string }>();
	const { id: organizationId } = params;

	const { organization: fetchedData, setOrganization } =
		useFetchOrgById(organizationId);
	const { deleteOrganization } = useDeleteOrg();

	const organization = fetchedData?.organization;
	const organizationStatus = fetchedData?.organizationStatus;
	const role = fetchedData?.role;

	const [organizationUsers, setOrganizationUsers] = useState<
		OrgUserResponse[] | undefined
	>(undefined);

	useEffect(() => {
		organization && setOrganizationUsers(organization?.organizationUsers);
	}, [organization]);

	useEffect(() => {
		organizationId !== cookieOrgId &&
			replace(`/workspace/organizations/${cookieOrgId}`);
	}, [cookieOrgId]);

	const hasPermission = role === "ADMIN" || role === "OWNER";

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Organization"
				title={organization?.title as string}
				desc={`${organization?.description}`}
				extraDesc={`Participants: ${organization?._count?.organizationUsers} | Teams: ${organization?._count?.teams} | Projects: ${organization?._count?.projects}`}
				joinCode={hasPermission && organization?.joinCode}
				button={role === "OWNER" && "Update Organization"}
				buttonAction={() => role === "OWNER" && setOpenModalUpdate(true)}
			/>
			{role === OrgRole.VIEWER ? (
				<LackPermission />
			) : (
				<div className={pageStyles["workspace-content-col"]}>
					<WindowContainer
						title={organization?.title as string}
						subtitle={`Projects: ${organization?._count?.projects}`}
						fullPage
					>
						{fetchedData?.organization.projects && (
							<ProjectElements
								isWindowElement
								organizationId={organizationId}
								projects={organization?.projects}
								isAdministrate={hasPermission}
							/>
						)}
					</WindowContainer>
					<WindowContainer
						title={organization?.title as string}
						subtitle={`Teams: ${organization?._count?.teams}`}
						fullPage
					>
						{fetchedData?.organization.teams && (
							<TeamElements
								isWindowElement
								organizationId={organizationId}
								teams={organization?.teams}
								isAdministrate={hasPermission}
							/>
						)}
					</WindowContainer>
					{hasPermission && (
						<WindowContainer
							title={organization?.title as string}
							subtitle={`Participants: ${organization?._count?.organizationUsers}`}
							fullPage
						>
							{organizationUsers && (
								<OrganizationUsers
									organizationId={organizationId}
									organizationUsers={organizationUsers}
									setOrganizationUsers={setOrganizationUsers}
									administrateRole={role}
								/>
							)}
						</WindowContainer>
					)}
					{role === "OWNER" && (
						<Button type="button" onClick={() => setOpenModal(true)}>
							<Trash size={22} className="mr-4" />
							Delete organization
						</Button>
					)}

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
										If you proceed on this action you will delete teams and
										projects which are related to this organization. Make sure
										that you understand that.
									</p>
								</div>
								<div className="w-full h-full flex justify-center items-center">
									<Button
										type="button"
										onClick={() =>
											deleteOrganization(organizationId, {
												onSuccess: () => saveOrganization(null),
											})
										}
									>
										<Trash size={22} className="mr-4" /> Delete
									</Button>
								</div>
							</div>
						</ModalWindow>
					)}

					{openModalUpdate && (
						<ModalWindow
							title="Update Organization.exe"
							subtitle="It's time to update :()"
							onClose={() => setOpenModalUpdate(false)}
						>
							{organization && (
								<div className="container bg-background flex flex-col justify-center items-center p-4 gap-y-8 w-auto h-auto">
									<OrganizationUpdate
										id={organization.id}
										data={organization}
										pullUpdatedData={setOrganization}
										pullCloseModal={setOpenModalUpdate}
									/>
								</div>
							)}
						</ModalWindow>
					)}
				</div>
			)}
		</PageLayout>
	);
}
