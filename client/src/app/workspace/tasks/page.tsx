"use client";

import {
	Checkbox,
	NotSelected,
	PageHeader,
	PageLayout,
	Select,
	TasksWindow,
} from "@/src/components";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchProjects } from "@/src/hooks/project/useFetchProjects";
import { useFetchTasks } from "@/src/hooks/tasks/useFetchTasks";
import { useFetchTeams } from "@/src/hooks/team/useFetchTeams";
import { useEffect, useState } from "react";

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

	useEffect(() => {
		if (selectedProject) handleRefetch();
	}, [selectedAvailable, selectedProject, selectedTeam]);

	useEffect(() => {
		console.log(taskList);
	}, [taskList]);

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Tasks"
				title="Manage your tasks"
				desc="This page is dedicated for managing tasks which are available for you."
			/>
			<div className="additional-blocks px-4 py-4 w-full">
				<div className="action-block flex flex-col gap-y-0.5 w-full border-4 border-foreground">
					<div className="title text-base font-semibold w-full border-b border-foreground px-2 py-2">
						<h4>Available actions:</h4>
					</div>
					<form className="container border-t border-foreground flex flex-row justify-start items-center w-full p-2 gap-x-4">
						{projects && (
							<Select
								id="project-select"
								placeholder="Filter by Project"
								options={projects.map(item => ({
									value: item.id,
									label: item.title,
								}))}
								onChange={data => setSelectedProject(data.target.value)}
								extra="flex flex-col max-w-52 w-full"
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
								extra="flex flex-col max-w-52 w-full"
							/>
						)}
						<Checkbox
							id="team-select"
							label="Assigned to you"
							checked={selectedAvailable}
							onChange={() => setSelectedAvailable(!selectedAvailable)}
						/>
					</form>
				</div>
			</div>
			{!selectedProject ? (
				<NotSelected element="Project" />
			) : (
				<TasksWindow taskList={taskList} setTaskList={setTaskList} isPage />
			)}
		</PageLayout>
	);
}
