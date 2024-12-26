"use client";

import pageStyles from "@/app/page.module.scss";
import {
	AddProjectUsers,
	Button,
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
import { ProjectRole } from "@/types/project.types";
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

	const { project: fetchedData, setProject } = useFetchProjectById(projectId);
	const { deleteProject } = useDeleteProject();

	const project = fetchedData?.project;
	const projectStatus = fetchedData?.projectStatus;
	const projectRole = fetchedData?.role;
	const role = fetchedData?.user?.organizationUsers[0].role;
	const organization = project?.organization;

	const { teamList, setTeamList } = useFetchTeamsByProject(
		organizationId,
		projectId
	); // Отримуємо список команд організації

	const hasPermission =
		role === "ADMIN" || role === "OWNER" || projectRole === ProjectRole.MANAGER;

	return project ? (
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
					<div className="action-block flex flex-col gap-y-0.5 w-full border-4 border-foreground">
						<div className="title text-base font-semibold w-full border-b border-foreground px-2 py-2">
							<h4>Available actions:</h4>
						</div>
						<div className="container border-t border-foreground flex flex-row justify-start items-center w-full p-2 gap-x-4">
							<Button
								block
								negative
								type="button"
								onClick={() => setOpenModalUser(true)}
							>
								Manage user
							</Button>
							{(role === "ADMIN" || role === "OWNER") && (
								<Button
									block
									negative
									type="button"
									onClick={() => setOpenModalAddUser(true)}
								>
									Add user
								</Button>
							)}
						</div>
					</div>
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
							isAdministrate={role === "ADMIN" || role === "OWNER"}
							setTeamList={setTeamList}
						/>
					)}
				</WindowContainer>
				{hasPermission && (
					<Button type="button" onClick={() => setOpenModal(true)}>
						<Trash size={22} className="mr-4" /> Delete Project
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
									If you proceed on this action you will delete tasks and
									assigns of teams which are related to this project. Make sure
									that you understand that.
								</p>
							</div>
							<div className="w-full h-full flex justify-center items-center">
								<Button
									type="button"
									onClick={() =>
										deleteProject(projectId, {
											onSuccess: () => replace("/workspace/projects"),
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
						title="Update Project.exe"
						subtitle="It's time to update :()"
						onClose={() => setOpenModalUpdate(false)}
					>
						{organization && organizationId && (
							<div className="container bg-background flex flex-col justify-center items-center p-4 gap-y-8 w-auto h-auto">
								<ProjectUpdate
									id={projectId}
									organizationId={organizationId}
									data={project}
									pullCloseModal={setOpenModalUpdate}
									pullUpdatedData={setProject}
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
		<NotFoundId elementTitle="Project" />
	);
}
