"use client";

import { Button, Field, Select } from "@/components/index";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import { useCreateProject } from "@/src/hooks/project/useCreateProject";
import { useFetchProjects } from "@/src/hooks/project/useFetchProjects";
import { OrgResponse } from "@/src/types/org.types";
import { ProjectFormData, ProjectResponse } from "@/src/types/project.types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ProjectCreate() {
	const [organizations, setOrganizations] = useState<OrgResponse[]>();

	const { organizationList } = useFetchOrgs();
	const { createProject, createdProject } = useCreateProject();

	const { register, handleSubmit, reset } = useForm<ProjectFormData>({
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<ProjectFormData> = data => {
		createProject(data);
	};

	useEffect(() => {
		if (organizationList) {
			setOrganizations(organizationList);
		}
	}, [organizationList]);

	useEffect(() => {
		createdProject?.id && reset();
	}, [createdProject]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Create your own project</h5>
			</div>
			<div className="text-block">
				<p>Please write the title and description for your project.</p>
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
								maxLength: { value: 500, message: "Description is too long" }, // Валідація на довжину
							})}
						/>
						<Select
							id="organization-select"
							label="Select Organization:"
							placeholder="Choose an organization"
							options={organizations.map(item => ({
								value: item.organization.id,
								label: item.organization.title,
							}))}
							{...register("organizationId", {
								required: "Organization is required!",
							})}
							extra="flex flex-col max-w-80 w-full"
						/>
						<div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
							<Button type="button" block>
								Create Project
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
