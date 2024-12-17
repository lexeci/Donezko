"use client";

import { Button, Field, Select } from "@/components/index";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import { useFetchProjects } from "@/src/hooks/project/useFetchProjects";
import { useTeamCreation } from "@/src/hooks/team/useTeamCreation";
import { OrgResponse } from "@/src/types/org.types";
import { ProjectResponse } from "@/src/types/project.types";
import { TeamFormData } from "@/src/types/team.types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function TeamCreate({
	organizationId: localOrgId,
	organizationTitle: localOrgTitle,
}: {
	organizationId?: string;
	organizationTitle?: string;
}) {
	const [organizations, setOrganizations] = useState<OrgResponse[]>();
	const [organizationId, setOrganizationId] = useState<string | undefined>();
	const [projects, setProjects] = useState<ProjectResponse[]>();

	const { organizationList } = useFetchOrgs(); // Отримуємо список організацій
	const { projects: projectList } = useFetchProjects(organizationId); // Отримуємо проекти для вибраної організації
	const { createTeam, newTeam } = useTeamCreation();

	const { register, handleSubmit, reset, setValue, watch } =
		useForm<TeamFormData>({
			mode: "onChange",
		});

	// Хендлер для вибору організації
	const handleOrgSelect = (value: string) => {
		setOrganizationId(value); // Оновлюємо id вибраної організації
		setValue("organizationId", value); // Встановлюємо це значення в форму
	};

	const onSubmit: SubmitHandler<TeamFormData> = data => {
		createTeam(data); // Створюємо команду
	};

	useEffect(() => {
		localOrgId && setOrganizationId(localOrgId);
	}, [localOrgId]);

	useEffect(() => {
		if (organizationList) {
			setOrganizations(organizationList); // Оновлюємо список організацій
		}
	}, [organizationList]);

	// Оновлення списку проектів після вибору організації
	useEffect(() => {
		if (organizationId) {
			// Збираємо проекти тільки для вибраної організації
			setProjects(projectList);
		} else {
			setProjects([]); // Якщо організація не вибрана, проекти порожні
		}
	}, [organizationId, projectList]);

	// Скидання форми після створення нової команди
	useEffect(() => {
		if (newTeam?.id) {
			reset(); // Скидаємо форму після успішного створення команди
		}
	}, [newTeam]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Create your own team</h5>
			</div>
			<div className="text-block">
				<p>Please write the title and description for your team.</p>
			</div>
			<div className="operate-window flex justify-center items-center h-full">
				{organizations && (
					<form
						className="w-full relative flex flex-col items-center flex-wrap md:justify-between gap-y-3 px-6 py-8"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Field
							extra="flex flex-col max-w-80 w-full"
							id="title"
							label="Title:"
							placeholder="Enter title:"
							type="text"
							{...register("title", {
								required: "Title is required!",
							})}
						/>
						<Field
							extra="flex flex-col max-w-80 w-full"
							id="description"
							label="Description:"
							placeholder="Enter description"
							type="text"
							{...register("description", {
								maxLength: { value: 500, message: "Description is too long" },
							})}
						/>
						{!localOrgId ? (
							<Select
								id="organization-select"
								label="Select Organization:"
								placeholder="Choose an organization"
								options={organizations.map(item => ({
									value: item.organization.id,
									label: item.organization.title,
								}))}
								onChange={e => handleOrgSelect(e.target.value)} // Оновлення організації
								extra="flex flex-col max-w-80 w-full"
							/>
						) : (
							<Field
								extra="flex flex-col max-w-80 w-full"
								id="organization-select"
								label="Select Organization:"
								placeholder="Choose an organization"
								type="text"
								value={localOrgTitle ? localOrgTitle : "Current organization"}
								disabled
							/>
						)}
						{/* Якщо організацію вибрано, показуємо список проектів */}
						{organizationId && projects && (
							<Select
								id="project-select"
								label="Select Project:"
								placeholder="Choose a Project"
								options={projects.map(item => ({
									value: item.id,
									label: item.title,
								}))}
								{...register("projectId", {
									required: "Project is required!",
								})}
								extra="flex flex-col max-w-80 w-full"
							/>
						)}

						{/* Кнопка для створення команди */}
						<div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
							<Button type="button" block disabled={!organizationId}>
								Create Team
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
