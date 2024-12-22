"use client";

import { Button, Field, Select } from "@/components/index";
import { useFetchOrgUsers } from "@/src/hooks/organization/useFetchOrgUsers";
import { useCreateProject } from "@/src/hooks/project/useCreateProject";
import { OrgUserResponse } from "@/src/types/org.types";
import { Project, ProjectFormData } from "@/src/types/project.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ProjectCreate({
	organizationId,
	organizationTitle,
	setProjects,
}: {
	organizationId?: string | null;
	organizationTitle?: string;
	setProjects?: Dispatch<SetStateAction<Project[]>>;
}) {
	const { organizationUserList } = useFetchOrgUsers(organizationId);
	const [organizationUsers, setOrganizationUsersList] =
		useState<OrgUserResponse[]>();

	const { createProject, createdProject } = useCreateProject();

	const { register, handleSubmit, setValue, reset } = useForm<ProjectFormData>({
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<ProjectFormData> = data => {
		createProject(data);
	};

	useEffect(() => {
		organizationId && setValue("organizationId", organizationId);
	}, []);

	useEffect(() => {
		if (organizationUserList) {
			setOrganizationUsersList(organizationUserList);
		}
	}, [organizationUserList]);

	useEffect(() => {
		if (createdProject?.id) {
			reset();
			setProjects && setProjects(prevState => [...prevState, createdProject]);
		}
	}, [createdProject]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Create your own project in {organizationTitle}</h5>
			</div>
			<div className="text-block">
				<p>Please write the title and description for your project.</p>
			</div>
			<div className="operate-window flex justify-center items-center h-full">
				{organizationUsers && (
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
							id="manager-select"
							label="Select Manager:"
							placeholder="Choose an manager"
							options={organizationUsers.map(item => ({
								value: item.userId,
								label: item.user.name,
							}))}
							{...register("projectManagerId", {
								required: "Manager is required!",
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
