"use client";

import pageStyles from "@/app/page.module.scss";
import { Button, Field, Select } from "@/components/index";
import { useFetchOrgUsers } from "@/hooks/organization/useFetchOrgUsers";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { OrgUserResponse } from "@/types/org.types";
import { ProjectFormData } from "@/types/project.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ProjectCreate({
	organizationId,
	organizationTitle,
	handleRefetch,
	setOpen,
}: {
	organizationId?: string | null;
	organizationTitle?: string;
	handleRefetch: () => void;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const { organizationUserList } = useFetchOrgUsers({ organizationId });
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
			setOpen(false);
			handleRefetch();
		}
	}, [createdProject]);

	return (
		<div className={pageStyles["workspace-basic-content-window"]}>
			<div className={pageStyles["workspace-basic-content-window__title"]}>
				<h5>Create your own project in {organizationTitle}</h5>
			</div>
			<div className={pageStyles["workspace-basic-content-window__text-block"]}>
				<p>Please write the title and description for your project.</p>
			</div>
			<div
				className={pageStyles["workspace-basic-content-window__operate-window"]}
			>
				{organizationUsers && organizationUsers?.length > 0 ? (
					<form
						className={pageStyles["workspace-basic-content-window__form"]}
						onSubmit={handleSubmit(onSubmit)}
					>
						<Field
							extra={pageStyles["workspace-basic-content-window__form__fields"]}
							id="title"
							label="Title:"
							placeholder="Enter title:"
							type="text"
							{...register("title", {
								required: "Title is required!",
							})}
						/>
						<Field
							extra={pageStyles["workspace-basic-content-window__form__fields"]}
							id="description"
							label="Description:"
							placeholder="Enter description"
							type="text"
							{...register("description", {
								maxLength: { value: 500, message: "Description is too long" }, // Валідація на довжину
							})}
						/>
						<Select
							extra={pageStyles["workspace-basic-content-window__form__fields"]}
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
						/>

						<div
							className={
								pageStyles["workspace-basic-content-window__form__actions"]
							}
						>
							<Button type="button" block>
								Create Project
							</Button>
						</div>
					</form>
				) : (
					<div
						className={pageStyles["workspace-basic-content-window__text-block"]}
					>
						<p>You cannot create a project due lack of members</p>
					</div>
				)}
			</div>
		</div>
	);
}
