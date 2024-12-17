"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem, ModalWindow } from "@/components/index";
import { useFetchProjects } from "@/src/hooks/project/useFetchProjects";
import { ProjectResponse } from "@/src/types/project.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ProjectCreate from "./ProjectCreate";

interface ProjectElementsProps {
	isWindowElement?: boolean;
	organizationId?: string;
	organizationTitle?: string;
	projects?: ProjectResponse[];
}

const ProjectElementsWithData = ({
	projects,
}: {
	projects: ProjectResponse[];
}) => {
	return projects.map((project, i) => {
		const { _count } = project;
		return (
			<EntityItem
				key={generateKeyComp(`${project.title}__${i}`)}
				icon={<Buildings size={84} />}
				linkBase={`/workspace/projects/${project.id}`}
				title={project.title}
				firstStat={`Teams: ${_count?.projectTeams}`}
				secondaryStat={`Tasks: ${_count?.tasks}`}
			/>
		);
	});
};

const ProjectElementsWithoutData = ({
	onCountChange,
}: {
	onCountChange: (count: number) => void;
}) => {
	const { projects } = useFetchProjects();

	// Використовуємо `useEffect` для оновлення кількості проектів
	useEffect(() => {
		if (projects?.length) {
			onCountChange(projects.length);
		}
	}, [projects, onCountChange]);

	return projects?.map((project, i) => {
		const { _count } = project;
		return (
			<EntityItem
				key={generateKeyComp(`${project.title}__${i}`)}
				icon={<Buildings size={84} />}
				linkBase={`/workspace/projects/${project.id}`}
				title={project.title}
				firstStat={`Teams: ${_count?.projectTeams}`}
				secondaryStat={`Tasks: ${_count?.tasks}`}
			/>
		);
	});
};

export default function ProjectElements({
	isWindowElement,
	organizationId,
	organizationTitle,
	projects,
}: ProjectElementsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [projectCount, setProjectCount] = useState<number>(
		projects?.length || 0
	);

	return (
		<div
			className={clsx(
				pageStyles["workspace-content-col"],
				isWindowElement && "h-full w-full max-w-full !p-0 !justify-start"
			)}
		>
			{open && (
				<ModalWindow
					title="Project manager.exe"
					subtitle="The manager to operate your project"
					onClose={() => setOpen(false)}
				>
					<ProjectCreate
						organizationId={organizationId}
						organizationTitle={organizationTitle}
					/>
				</ModalWindow>
			)}
			<div className="counter w-full flex flex-row justify-between items-center">
				<div
					className={clsx(
						"title",
						isWindowElement &&
							"py-2 px-4 bg-background border border-foreground"
					)}
				>
					<h4>Total Projects: {projectCount}</h4>
				</div>
				<Button type="button" onClick={() => setOpen(true)} negative block>
					<Plus size={22} className="mr-4" /> Project
				</Button>
			</div>
			<div
				className={clsx(
					pageStyles["workspace-content-grid-3"],
					isWindowElement && "!p-0"
				)}
			>
				{projects?.length || projects != undefined ? (
					<ProjectElementsWithData projects={projects} />
				) : (
					<ProjectElementsWithoutData onCountChange={setProjectCount} />
				)}
			</div>
		</div>
	);
}
