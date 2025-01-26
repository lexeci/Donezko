"use client";

import {
	ActionBlock,
	Checkbox,
	NotSelected,
	PageHeader,
	PageLayout,
	Select,
	TasksWindow,
} from "@/components/index";
import { useFetchProjects } from "@/hooks/project/useFetchProjects";
import { useFetchTasks } from "@/hooks/tasks/useFetchTasks";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useState } from "react";

import pageStyles from "@/app/page.module.scss";
import { useFetchOrgRole } from "@/src/hooks/organization/useFetchOrgRole";
import { useFetchTeamsByProject } from "@/src/hooks/team/useFetchTeamsByProject";
import { AccessStatus } from "@/src/types/root.types";
import styles from "./page.module.scss";
import { OrgRole } from "@/src/types/org.types";

export default function Tasks() {
	const [selectedAvailable, setSelectedAvailable] = useState<boolean>(false);
	const [selectedProject, setSelectedProject] = useState<string | undefined>(
		undefined
	);
	const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
		undefined
	);
	const { organizationId } = useOrganization();
	const { organizationRole } = useFetchOrgRole(organizationId);
	const { projects: projectsData } = useFetchProjects(organizationId);
	const { teamList: teamsData } = useFetchTeamsByProject(
		organizationId,
		selectedProject
	);
	const { taskList, setTaskList, handleRefetch } = useFetchTasks({
		organizationId,
		projectId: selectedProject,
		teamId: selectedTeam,
		available: selectedAvailable,
	});

	const canAdministrate =
		organizationRole &&
		(organizationRole.role === OrgRole.OWNER ||
			organizationRole.role === OrgRole.ADMIN);

	const teamList = teamsData?.inProject.filter(item => {
		const access = item.teamUsers?.[0];
		return canAdministrate || access?.teamStatus === AccessStatus.ACTIVE;
	});

	const projectList = projectsData?.filter(item => {
		const access = item.projectUsers?.[0];
		return canAdministrate || access?.projectStatus === AccessStatus.ACTIVE;
	});

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Tasks"
				title="Manage your tasks"
				desc="This page is dedicated for managing tasks which are available for you."
			/>
			<div className={styles["additional-blocks"]}>
				<ActionBlock>
					{projectList && (
						<Select
							id="project-select"
							placeholder="Filter by Project"
							options={projectList.map(item => ({
								value: item.id,
								label: item.title,
							}))}
							onChange={data => setSelectedProject(data.target.value)}
							extra={styles.fields}
						/>
					)}
					{teamList && (
						<Select
							id="team-select"
							placeholder="Filter by Team"
							options={teamList.map(item => ({
								value: item.id,
								label: item.title,
							}))}
							onChange={data => setSelectedTeam(data.target.value)}
							extra={styles.fields}
						/>
					)}
					<Checkbox
						id="team-select"
						label="Assigned to you"
						checked={selectedAvailable}
						onChange={() => setSelectedAvailable(!selectedAvailable)}
					/>
				</ActionBlock>
			</div>
			{!selectedProject ? (
				<NotSelected element="project" />
			) : teamList && teamList?.length > 0 ? (
				<TasksWindow
					taskList={taskList}
					setTaskList={setTaskList}
					isPage
					projectId={selectedProject}
					handleRefetch={handleRefetch}
				/>
			) : (
				<div className={pageStyles["workspace-not-found"]}>
					<h5>You don't have any teams in current project.</h5>
				</div>
			)}
		</PageLayout>
	);
}
