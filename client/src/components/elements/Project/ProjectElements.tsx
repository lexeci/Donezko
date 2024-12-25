"use client";

import pageStyles from "@/app/page.module.scss";

import {
	Button,
	EntityItem,
	LackPermission,
	ModalWindow,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useFetchProjects } from "@/hooks/project/useFetchProjects";
import { OrgRole } from "@/types/org.types";
import { Project } from "@/types/project.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Buildings, CoinVertical } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ProjectCreate from "./ProjectCreate";

interface ProjectElementsProps {
	isWindowElement?: boolean;
	organizationId?: string;
	organizationTitle?: string;
	projects?: Project[];
	isAdministrate?: boolean;
}

const ProjectElementsItem = ({ projects }: { projects: Project[] }) => {
	return projects.length > 0 ? (
		projects.map((project, i) => {
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
		})
	) : (
		<div className="w-full h-full bg-background p-8">
			<h5 className="font-bold text-base">There is no project for you</h5>
		</div>
	);
};

export default function ProjectElements({
	isWindowElement,
	organizationId: localId,
	organizationTitle,
	projects,
	isAdministrate,
}: ProjectElementsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [projectCount, setProjectCount] = useState<number>(
		projects?.length || 0
	);

	// Якщо `organizationId` передано, використовуємо його, інакше виконуємо запит
	const { organizationId } = useOrganization();
	const effectiveOrganizationId = localId || organizationId;

	// Якщо `isAdministrate` передано, використовуємо його, інакше перевіряємо роль
	const { organizationRole } = useFetchOrgRole(effectiveOrganizationId);

	// Визначаємо, чи може користувач адміністративно діяти
	const canAdministrate =
		isAdministrate !== undefined
			? isAdministrate
			: organizationRole &&
			  (organizationRole.role === "OWNER" ||
					organizationRole.role === "ADMIN");

	// Отримуємо або передані, або завантажені проекти
	const { projects: projectList, setProjects } = projects?.length
		? { projects, setProjects: () => {} }
		: useFetchProjects(effectiveOrganizationId);

	useEffect(() => {
		setProjectCount(projectList.length);
	}, [projectList]);

	return organizationRole ? (
		organizationRole.role === OrgRole.VIEWER ? (
			<LackPermission />
		) : (
			<div
				className={clsx(
					pageStyles["workspace-content-col"],
					isWindowElement && "h-full w-full max-w-full !p-0 !justify-start"
				)}
			>
				{/* Модальне вікно */}
				{open && canAdministrate && (
					<ModalWindow
						title="Project manager.exe"
						subtitle="The manager to operate your project"
						onClose={() => setOpen(false)}
					>
						<ProjectCreate
							organizationId={effectiveOrganizationId}
							organizationTitle={organizationTitle}
							setProjects={setProjects}
						/>
					</ModalWindow>
				)}

				{/* Лічильник проєктів та кнопка створення */}
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
					{canAdministrate && (
						<Button type="button" onClick={() => setOpen(true)} negative block>
							<Plus size={22} className="mr-4" /> Project
						</Button>
					)}
				</div>

				{/* Відображення проєктів */}
				<div
					className={clsx(
						pageStyles["workspace-content-grid-3"],
						isWindowElement && "!p-0"
					)}
				>
					<ProjectElementsItem projects={projectList} />
				</div>
			</div>
		)
	) : (
		<div className="h-full flex justify-center items-center">
			<CoinVertical size={80} className="m-auto animate-spin" />
		</div>
	);
}
