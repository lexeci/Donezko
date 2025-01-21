"use client";

import pageStyles from "@/app/page.module.scss";
import { Button, Field } from "@/components/index";
import { useUpdateTeam } from "@/hooks/team/useUpdateTeam";
import { useOrganization } from "@/src/context/OrganizationContext";
import { Team, TeamFormData } from "@/types/team.types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TeamUpdate {
	id: string;
	data: TeamFormData;
	pullUpdatedData: Dispatch<SetStateAction<Team | undefined>>;
	pullCloseModal: Dispatch<SetStateAction<boolean>>;
}

export default function TeamUpdate({
	id,
	data: localData,
	pullUpdatedData,
	pullCloseModal,
}: TeamUpdate) {
	const { organizationId } = useOrganization();
	const { updateTeam, updatedTeam } = useUpdateTeam();

	const { register, handleSubmit, setValue, reset } = useForm<TeamFormData>({
		mode: "onChange",
	});

	useEffect(() => {
		setValue("title", localData.title);
		setValue("description", localData.description);
	}, []);

	const onSubmit: SubmitHandler<TeamFormData> = data => {
		organizationId && updateTeam({ id, data, organizationId });
	};

	useEffect(() => {
		updatedTeam?.team.id && reset(updatedTeam.team);
		updatedTeam?.team.id && pullUpdatedData(updatedTeam.team);

		updatedTeam?.team.id && pullCloseModal(false);
	}, [updatedTeam]);

	return (
		<div className={pageStyles["workspace-basic-content-window"]}>
			<div className={pageStyles["workspace-basic-content-window__title"]}>
				<h5>Update your team</h5>
			</div>
			<div className={pageStyles["workspace-basic-content-window__text-block"]}>
				<p>Please write the title and description for your team.</p>
			</div>
			<div
				className={pageStyles["workspace-basic-content-window__operate-window"]}
			>
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
					<div
						className={
							pageStyles["workspace-basic-content-window__form__actions"]
						}
					>
						<Button type="button" block>
							Update Team
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
