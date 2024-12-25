"use client";

import { Button, Field } from "@/components/index";
import { useJoinOrg } from "@/hooks/organization/useJoinOrg";
import { JoinOrgType } from "@/types/org.types";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function OrganizationJoin() {
	const { joinOrganization, joinedOrganization } = useJoinOrg();

	const { register, handleSubmit, setValue, reset } = useForm<JoinOrgType>({
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<JoinOrgType> = data => {
		joinOrganization(data);
	};

	useEffect(() => {
		joinedOrganization?.id && reset(joinedOrganization);
	}, [joinedOrganization]);

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-8">
			<div className="title text-lg font-bold">
				<h5>Join to your organization</h5>
			</div>
			<div className="text-block">
				<p>
					Please write the title and join code to connect with organization.
				</p>
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
						id="joinCode"
						label="JoinCode:"
						placeholder="Enter joinCode:"
						type="text"
						{...register("joinCode", {
							required: "JoinCode is required!",
						})}
					/>
					<div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
						<Button type="button" block>
							Accept Join
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
