"use client";

import pageStyles from "@/app/page.module.scss";
import {
	Button,
	ModalWindow,
	PageHeader,
	PageLayout,
	ProjectUpdate,
} from "@/src/components";
import { useDeleteProject } from "@/src/hooks/project/useDeleteProject";
import { useFetchProjectById } from "@/src/hooks/project/useFetchProjectById";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Project() {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

	const params = useParams<{ id: string }>();
	const { id: projectId } = params;

	const { project: fetchedData, setProject } = useFetchProjectById(projectId);
	const { deleteProject } = useDeleteProject();

	const project = fetchedData?.project;
	const projectStatus = fetchedData?.projectStatus;
	const role = fetchedData?.user?.organizationUsers[0].role;
	const organization = project?.organization;

	const hasPermission = role === "ADMIN" || role === "OWNER";

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Project"
				title={project?.title as string}
				desc={project?.description as string}
				extraDesc={
					project &&
					`Teams: ${project?._count?.projectTeams} | Tasks: ${project?._count?.tasks}`
				}
				extraInfo={organization && `Organization: ${organization?.title}`}
				button={hasPermission && "Update Project"}
				buttonAction={() => hasPermission && setOpenModalUpdate(true)}
			/>
			<div className={pageStyles["workspace-content-col"]}>
				<Button type="button">
					<Trash size={22} className="mr-4" /> Delete Project
				</Button>
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
									If you proceed on this action you will delete teams and tasks
									which are related to this project. Make sure that you
									understand that.
								</p>
							</div>
							<div className="w-full h-full flex justify-center items-center">
								<Button type="button" onClick={() => deleteProject(projectId)}>
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
						{organization && project.organizationId && (
							<div className="container bg-background flex flex-col justify-center items-center p-4 gap-y-8 w-auto h-auto">
								<ProjectUpdate
									id={projectId}
									organizationId={project.organizationId}
									data={project}
									pullCloseModal={setOpenModalUpdate}
									pullUpdatedData={setProject}
								/>
							</div>
						)}
					</ModalWindow>
				)}
			</div>
		</PageLayout>
	);
}
