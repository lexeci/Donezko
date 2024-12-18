"use client";

import { AnimatedLink } from "@/components/index";
import { SetStateAction, useState } from "react";
import ModalWindow from "../ModalWindow/ModalWindow";
import OrganizationCreate from "./OrganizationCreate";
import OrganizationJoin from "./OrganizationJoin";

export default function OrganizationModal({
	setOpen,
}: {
	setOpen: (value: SetStateAction<boolean>) => void;
}) {
	const [formType, setFormType] = useState<"join" | "create">("join");

	return (
		<ModalWindow
			title="Organization manager.exe"
			subtitle="The manager to operate your organization"
			onClose={() => setOpen(false)}
		>
			<div className="switcher flex flex-row justify-between items-center w-full border border-foreground bg-background p-4 ml-auto">
				<div className="title text-lg font-bold">
					<h5>Please choose your action: </h5>
				</div>
				<AnimatedLink
					type="button"
					link="#"
					title={
						formType !== "join" ? "I want to join!" : "I want to create my own!"
					}
					onClick={() =>
						formType !== "join" ? setFormType("join") : setFormType("create")
					}
				/>
			</div>
			{formType !== "join" ? <OrganizationCreate /> : <OrganizationJoin />}
		</ModalWindow>
	);
}
