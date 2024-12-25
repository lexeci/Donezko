"use client";

import { Button, Field } from "@/components/index";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import { ProjectFormData, ProjectResponse } from "@/types/project.types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ProjectUpdate {
	id: string;
	organizationId: string;
	data: ProjectFormData;
	pullUpdatedData: Dispatch<SetStateAction<ProjectResponse | null>>;
	pullCloseModal: Dispatch<SetStateAction<boolean>>;
}

export default function ProjectUpdate({
	id,
	organizationId,
	data: localData,
	pullUpdatedData,
	pullCloseModal,
}: ProjectUpdate) {
	const { updateProject, updatedProject } = useUpdateProject();

	const { register, handleSubmit, setValue, reset } = useForm<ProjectFormData>({
		mode: "onChange",
	});

	useEffect(() => {
		setValue("title", localData.title);
		setValue("description", localData.description);
	}, []);

	const onSubmit: SubmitHandler<ProjectFormData> = localData => {
		updateProject({
			id,
			data: {
				organizationId,
				title: localData.title,
				description: localData.description,
			},
		});
	};

	useEffect(() => {
		updatedProject?.project.id && reset(updatedProject.project);
		updatedProject?.project.id && pullUpdatedData(updatedProject);

		updatedProject?.project.id && pullCloseModal(false);
	}, [updatedProject]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Update your project</h5>
			</div>
			<div className="text-block">
				<p>Please write the title and description for your project.</p>
			</div>
			<div className="operate-window flex justify-center items-center h-full">
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
					<div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
						<Button type="button" block>
							Update Organization
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
