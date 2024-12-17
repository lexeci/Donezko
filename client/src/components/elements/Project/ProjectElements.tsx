"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem, ModalWindow } from "@/components/index";
import { useFetchProjects } from "@/src/hooks/project/useFetchProjects";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import ProjectCreate from "./ProjectCreate";

export default function ProjectElements() {
	const { projects } = useFetchProjects();
	const [open, setOpen] = useState<boolean>(false);

	console.log(projects);

	return (
		<div className={pageStyles["workspace-content-col"]}>
			{open && (
				<ModalWindow
					title="Project manager.exe"
					subtitle="The manager to operate your project"
					onClose={() => setOpen(false)}
				>
					<ProjectCreate />
				</ModalWindow>
			)}
			<div className="counter w-full flex flex-row justify-between items-center">
				<div className="title">
					<h4>Total Projects: {projects?.length}</h4>
				</div>
				<Button type="button" onClick={() => setOpen(true)}>
					<Plus size={22} className="mr-4" /> Project
				</Button>
			</div>
			<div className={pageStyles["workspace-content-grid-3"]}>
				{projects?.map((project, i) => {
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
				})}
			</div>
		</div>
	);
}
