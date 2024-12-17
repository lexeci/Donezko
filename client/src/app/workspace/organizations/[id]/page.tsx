"use client";

import pageStyles from "@/app/page.module.scss";
import {
	Button,
	ModalWindow,
	OrganizationUsers,
	PageHeader,
	PageLayout,
	ProjectElements,
	TeamElements,
	WindowContainer,
} from "@/src/components";
import { useDeleteOrg } from "@/src/hooks/organization/useDeleteOrg";
import { useFetchOrgById } from "@/src/hooks/organization/useFetchOrgById";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Organization() {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const params = useParams<{ id: string }>();
	const { id: organizationId } = params;

	const { organization: fetchedData } = useFetchOrgById(organizationId);
	const { deleteOrganization } = useDeleteOrg();

	const organization = fetchedData?.organization;
	const organizationStatus = fetchedData?.organizationStatus;
	const role = fetchedData?.role;

	console.log(organization);

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Organization"
				title={organization?.title as string}
				desc={`${organization?.description}\nParticipants: ${organization?._count?.organizationUsers} | Teams: ${organization?._count?.teams} | Projects: ${organization?._count?.projects}`}
			/>
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
						/>
					)}
				</WindowContainer>
				{role === "ADMIN" ||
					(role === "OWNER" && (
						<WindowContainer
							title={organization?.title as string}
							subtitle={`Participants: ${organization?._count?.organizationUsers}`}
							fullPage
						>
							{organization?.organizationUsers && (
								<OrganizationUsers
									organizationId={organizationId}
									organizationUsers={organization.organizationUsers}
								/>
							)}
						</WindowContainer>
					))}
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
									onClick={() => deleteOrganization(organizationId)}
								>
									<Trash size={22} className="mr-4" /> Delete
								</Button>
							</div>
						</div>
					</ModalWindow>
				)}
			</div>
		</PageLayout>
	);
}
