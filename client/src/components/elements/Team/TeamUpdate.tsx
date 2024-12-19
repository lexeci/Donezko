"use client";

import { Button, Field } from "@/components/index";
import { useModifyTeam } from "@/src/hooks/team/useModifyTeam";
import { TeamFormData, TeamResponse } from "@/src/types/team.types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TeamUpdate {
	id: string;
	data: TeamFormData;
	pullUpdatedData: Dispatch<SetStateAction<TeamResponse | undefined>>;
	pullCloseModal: Dispatch<SetStateAction<boolean>>;
}

export default function TeamUpdate({
	id,
	data: localData,
	pullUpdatedData,
	pullCloseModal,
}: TeamUpdate) {
	const { updateTeam, updatedTeam } = useModifyTeam();

	const { register, handleSubmit, setValue, reset } = useForm<TeamFormData>({
		mode: "onChange",
	});

	useEffect(() => {
		setValue("title", localData.title);
		setValue("description", localData.description);
	}, []);

	const onSubmit: SubmitHandler<TeamFormData> = data => {
		updateTeam({ id, data });
	};

	useEffect(() => {
		updatedTeam?.team.id && reset(updatedTeam.team);
		updatedTeam?.team.id && pullUpdatedData(updatedTeam);

		updatedTeam?.team.id && pullCloseModal(false);
	}, [updatedTeam]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Update your team</h5>
			</div>
			<div className="text-block">
				<p>Please write the title and description for your team.</p>
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
							Update Team
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
