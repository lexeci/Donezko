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
import { useFetchTeams } from "@/hooks/team/useFetchTeams";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useState } from "react";

import styles from "./page.module.scss";

export default function Tasks() {
	const [selectedAvailable, setSelectedAvailable] = useState<boolean>(false);
	const [selectedProject, setSelectedProject] = useState<string | undefined>(
		undefined
	);
	const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
		undefined
	);
	const { organizationId } = useOrganization();
	const { projects } = useFetchProjects(organizationId);
	const { teamList } = useFetchTeams(organizationId);
	const { taskList, setTaskList, handleRefetch } = useFetchTasks({
		organizationId,
		projectId: selectedProject,
		teamId: selectedTeam,
		available: selectedAvailable,
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
					{projects && (
						<Select
							id="project-select"
							placeholder="Filter by Project"
							options={projects.map(item => ({
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
			) : (
				<TasksWindow
					taskList={taskList}
					setTaskList={setTaskList}
					isPage
					projectId={selectedProject}
					handleRefetch={handleRefetch}
				/>
			)}
		</PageLayout>
	);
}
