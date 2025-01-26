"use client";

import pageStyles from "@/app/page.module.scss";
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
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useDeleteOrg } from "@/hooks/organization/useDeleteOrg";
import { useExitOrg } from "@/hooks/organization/useExitOrg";
import { useFetchOrgById } from "@/hooks/organization/useFetchOrgById";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole, OrgUserResponse } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
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

	const { organizationRole } = useFetchOrgRole(organizationId);
	const role = organizationRole?.role ?? OrgRole.VIEWER;
	const status = organizationRole?.status ?? AccessStatus.BANNED;

	const { deleteOrganization } = useDeleteOrg();
	const { exitOrganization } = useExitOrg();

	const organization = fetchedData?.organization;

	const [organizationUsers, setOrganizationUsers] = useState<
		OrgUserResponse[] | undefined
	>(undefined);

	const handleExit = () => {
		exitOrganization(organizationId);
		saveOrganization(null);
	};

	useEffect(() => {
		organization && setOrganizationUsers(organization?.organizationUsers);
	}, [organization]);

	useEffect(() => {
		organizationId !== cookieOrgId &&
			replace(`${DASHBOARD_PAGES.ORGANIZATIONS}/${cookieOrgId}`);
	}, [cookieOrgId]);

	const hasPermission = role === OrgRole.ADMIN || role === OrgRole.OWNER;

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Organization"
				title={organization?.title as string}
				desc={`${organization?.description}`}
				extraDesc={`Participants: ${organization?._count?.organizationUsers} | Teams: ${organization?._count?.teams} | Projects: ${organization?._count?.projects}`}
				joinCode={hasPermission && organization?.joinCode}
				button={role === OrgRole.OWNER && "Update Organization"}
				buttonAction={() => role === OrgRole.OWNER && setOpenModalUpdate(true)}
			/>
			{role === OrgRole.VIEWER || status === AccessStatus.BANNED ? (
				<>
					<LackPermission />
					<div className="mb-4">
						<Button type="button" onClick={() => handleExit()}>
							<Trash size={22} className="mr-4" />
							Exit organization
						</Button>
					</div>
				</>
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

					<div className={pageStyles["workspace-actions"]}>
						{role === OrgRole.OWNER && (
							<Button type="button" onClick={() => setOpenModal(true)}>
								<Trash size={22} className="mr-4" />
								Delete organization
							</Button>
						)}

						{role !== OrgRole.OWNER && role !== OrgRole.ADMIN && (
							<Button type="button" onClick={() => handleExit()}>
								<Trash size={22} className="mr-4" />
								Exit organization
							</Button>
						)}
					</div>

					{openModal && (
						<ModalWindow
							title="Program to ask of sure action.exe"
							subtitle="Hey do you really know what you are doing ?"
							onClose={() => setOpenModal(false)}
						>
							<div className={pageStyles["workspace-modal-container"]}>
								<div className={pageStyles["workspace-modal-container__desc"]}>
									<h1>Hey did you know?</h1>
									<p>
										If you proceed on this action you will delete teams and
										projects which are related to this organization. Make sure
										that you understand that.
									</p>
								</div>
								<div
									className={
										pageStyles["workspace-modal-container__btn-container"]
									}
								>
									<Button
										type="button"
										onClick={() =>
											deleteOrganization(organizationId, {
												onSuccess: () => saveOrganization(null),
											})
										}
									>
										<Trash
											size={22}
											className={pageStyles["workspace-modal-container__ico"]}
										/>{" "}
										Delete
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
								<div className={pageStyles["workspace-modal-container"]}>
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
