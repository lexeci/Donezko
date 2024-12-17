"use client";

import { Button, Field } from "@/components/index";
import { useCreateOrg } from "@/src/hooks/organization/useCreateOrg";
import { OrgFormData } from "@/src/types/org.types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function OrganizationCreate() {
	const { createOrganization, newOrganization } = useCreateOrg();

	const { register, handleSubmit, setValue, reset } = useForm<OrgFormData>({
		mode: "onChange",
	});

	// Локальний стан для згенерованого joinCode
	const [joinCode, setJoinCode] = useState<string>("");

	// Генерація унікального коду приєднання
	const generateJoinCode = () => {
		const code = Math.random().toString(36).substr(2, 99).toUpperCase(); // Генеруємо код
		setJoinCode(code);
		setValue("joinCode", code); // Автоматично заповнюємо поле форми
	};

	useEffect(() => {
		generateJoinCode();
	}, []);

	const onSubmit: SubmitHandler<OrgFormData> = data => {
		createOrganization(data);
	};

	useEffect(() => {
		newOrganization?.organization.id && reset();
	}, [newOrganization]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Create your own organization</h5>
			</div>
			<div className="text-block">
				<p>Please write the title and description for your organization.</p>
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
					<div className="flex flex-row justify-center items-end gap-x-2 max-w-80">
						<Field
							extra="flex flex-col w-full"
							id="joinCode"
							label="JoinCode:"
							placeholder="Enter joinCode:"
							type="text"
							{...register("joinCode", {
								required: "JoinCode is required!",
							})}
							readOnly
							value={joinCode}
						/>
						<div className="w-28 text-xs">
							<Button
								type="button"
								fullWidth
								block
								onClick={e => {
									e.preventDefault();
									generateJoinCode();
								}}
							>
								Generate
							</Button>
						</div>
					</div>
					<div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
						<Button type="button" block>
							Create Organization
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
