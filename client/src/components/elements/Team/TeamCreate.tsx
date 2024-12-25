"use client";

import { Button, Field, Select } from "@/components/index";
import { useFetchOrgs } from "@/hooks/organization/useFetchOrgs";
import { useFetchOrgUsers } from "@/hooks/organization/useFetchOrgUsers";
import { useTeamCreation } from "@/hooks/team/useTeamCreation";
import { OrgResponse } from "@/types/org.types";
import { TeamFormData, TeamsResponse } from "@/types/team.types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function TeamCreate({
	organizationId: localOrgId,
	organizationTitle: localOrgTitle,
	setTeams,
}: {
	organizationId?: string | null;
	organizationTitle?: string;
	setTeams: (newTeam: TeamsResponse) => void;
}) {
	const [organizations, setOrganizations] = useState<OrgResponse[]>();
	const [organizationId, setOrganizationId] = useState<string | undefined>();
	const { organizationList } = useFetchOrgs(); // Отримуємо список організацій
	const { createTeam, newTeam } = useTeamCreation();
	const { organizationUserList } = useFetchOrgUsers(organizationId);

	const { register, handleSubmit, reset, setValue } = useForm<TeamFormData>({
		mode: "onChange",
	});

	// Хендлер для вибору організації
	const handleUserSelect = (value: string) => {
		setValue("teamLeaderId", value); // Встановлюємо це значення в форму
	};

	const onSubmit: SubmitHandler<TeamFormData> = data => {
		createTeam(data); // Створюємо команду
	};

	useEffect(() => {
		localOrgId && setOrganizationId(localOrgId);
		localOrgId
			? setValue("organizationId", localOrgId)
			: setOrganizationId(organizationId);
	}, [localOrgId, organizationId]);

	useEffect(() => {
		if (organizationList) {
			setOrganizations(organizationList); // Оновлюємо список організацій
		}
	}, [organizationList]);

	// Скидання форми після створення нової команди
	useEffect(() => {
		if (newTeam?.id) {
			reset(); // Скидаємо форму після успішного створення команди
			setValue("organizationId", organizationId);
			setTeams && setTeams(newTeam);
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
						{organizationUserList && (
							<Select
								id="leader-select"
								label="Select Leader:"
								placeholder="Choose a leader"
								options={organizationUserList.map(item => ({
									value: item.userId,
									label: item.user.name,
								}))}
								onChange={e => handleUserSelect(e.target.value)} // Оновлення організації
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
