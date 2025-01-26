"use client";

import pageStyles from "@/app/page.module.scss";
import {
	ActionBlock,
	AddProjectUsers,
	Button,
	LackPermission,
	ModalWindow,
	NotFoundId,
	PageHeader,
	PageLayout,
	ProjectUpdate,
	ProjectUsers,
	TeamElements,
	WindowContainer,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useDeleteProject } from "@/hooks/project/useDeleteProject";
import { useFetchProjectById } from "@/hooks/project/useFetchProjectById";
import { useFetchTeamsByProject } from "@/hooks/team/useFetchTeamsByProject";
import { useExitProject } from "@/src/hooks/project/useExitProject";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole } from "@/src/types/org.types";
import { ProjectRole } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Project() {
	const { replace } = useRouter();
	const { organizationId } = useOrganization();

	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
	const [openModalAddUser, setOpenModalAddUser] = useState<boolean>(false);
	const [openModalUser, setOpenModalUser] = useState<boolean>(false);

	const params = useParams<{ id: string }>();
	const { id: projectId } = params;

	const { project: fetchedData, handleRefetch } = useFetchProjectById(
		projectId,
		organizationId
	);
	const { deleteProject } = useDeleteProject();
	const { exitProject } = useExitProject();

	const userId = fetchedData?.userId;
	const project = fetchedData?.project;
	const projectStatus = fetchedData?.projectStatus;
	const projectRole = fetchedData?.role;
	const role = fetchedData?.user?.organizationUsers[0].role;
	const organization = project?.organization;

	const { teamList, setTeamList } = useFetchTeamsByProject(
		organizationId,
		projectId
	); // We get a list of organizations of the organization

	const hasPermission =
		role === OrgRole.ADMIN ||
		role === OrgRole.OWNER ||
		projectRole === ProjectRole.MANAGER;

	const handleExit = () => {
		userId &&
			organizationId &&
			exitProject(
				{
					projectId,
					userId,
					organizationId,
				},
				{
					onSuccess: () => {
						replace(DASHBOARD_PAGES.HOME);
					},
				}
			);
	};

	return project ? (
		projectStatus === AccessStatus.ACTIVE ? (
			<PageLayout>
				<PageHeader
					pageTitle="Project"
					title={project.title as string}
					desc={project.description as string}
					extraDesc={
						project &&
						`Teams: ${project._count?.projectTeams} | Tasks: ${project._count?.tasks}`
					}
					extraInfo={organization && `Organization: ${organization.title}`}
					button={hasPermission && "Update Project"}
					buttonAction={() => hasPermission && setOpenModalUpdate(true)}
				/>
				<div className={pageStyles["workspace-content-col"]}>
					{hasPermission && (
						<ActionBlock>
							<Button
								block
								negative
								type="button"
								onClick={() => setOpenModalUser(true)}
							>
								Manage user
							</Button>
							{(role === OrgRole.ADMIN || role === OrgRole.OWNER) && (
								<Button
									block
									negative
									type="button"
									onClick={() => setOpenModalAddUser(true)}
								>
									Add user
								</Button>
							)}
						</ActionBlock>
					)}
					<WindowContainer
						title={project.title as string}
						subtitle={`Teams: ${teamList?.inProject.length}`}
						fullPage
					>
						{teamList && organizationId && (
							<TeamElements
								isWindowElement
								organizationId={organizationId}
								organizationTitle={organization?.title}
								projectId={projectId}
								projectTitle={project.title}
								projectTeams={teamList}
								isAdministrate={
									role === OrgRole.ADMIN || role === OrgRole.OWNER
								}
								setTeamList={setTeamList}
							/>
						)}
					</WindowContainer>
					<div className={pageStyles["workspace-actions"]}>
						{hasPermission && (
							<Button type="button" onClick={() => setOpenModal(true)}>
								<Trash size={22} className="mr-4" /> Delete Project
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
										If you proceed on this action you will delete tasks and
										assigns of teams which are related to this project. Make
										sure that you understand that.
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
											organizationId &&
											deleteProject(
												{ projectId, organizationId },
												{
													onSuccess: () => replace(DASHBOARD_PAGES.PROJECTS),
												}
											)
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
							title="Update Project.exe"
							subtitle="It's time to update :()"
							onClose={() => setOpenModalUpdate(false)}
						>
							{organization && organizationId && (
								<div className={pageStyles["workspace-modal-container"]}>
									<ProjectUpdate
										id={projectId}
										organizationId={organizationId}
										data={project}
										pullCloseModal={setOpenModalUpdate}
										pullUpdatedData={handleRefetch}
									/>
								</div>
							)}
						</ModalWindow>
					)}
					{openModalAddUser && (
						<ModalWindow
							title="Add user to project.exe"
							subtitle="Someone will have work to do ;)"
							onClose={() => setOpenModalAddUser(false)}
						>
							{organization && organizationId && (
								<AddProjectUsers
									organizationId={organizationId}
									projectId={projectId}
								/>
							)}
						</ModalWindow>
					)}
					{openModalUser && (
						<ModalWindow
							title="Manage project user.exe"
							subtitle="Administrate your users within project"
							onClose={() => setOpenModalUser(false)}
						>
							{organization && organizationId && (
								<ProjectUsers projectId={projectId} role={role} />
							)}
						</ModalWindow>
					)}
				</div>
			</PageLayout>
		) : (
			<LackPermission />
		)
	) : (
		<NotFoundId elementTitle="Project" />
	);
}
