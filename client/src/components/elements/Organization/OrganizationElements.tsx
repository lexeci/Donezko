"use client";

import pageStyles from "@/app/page.module.scss";

import {
	AnimatedLink,
	Button,
	EntityItem,
	ModalWindow,
} from "@/components/index";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import OrganizationCreate from "./OrganizationCreate";
import OrganizationJoin from "./OrganizationJoin";

export default function OrganizationElements() {
	const { organizationList } = useFetchOrgs();
	const [open, setOpen] = useState<boolean>(false);
	const [formType, setFormType] = useState<"join" | "create">("join");

	console.log(organizationList);

	return (
		<div className={pageStyles["workspace-content-col"]}>
			{open && (
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
								formType !== "join"
									? "I want to join!"
									: "I want to create my own!"
							}
							onClick={() =>
								formType !== "join"
									? setFormType("join")
									: setFormType("create")
							}
						/>
					</div>
					{formType !== "join" ? <OrganizationCreate /> : <OrganizationJoin />}
				</ModalWindow>
			)}
			<div className="counter w-full flex flex-row justify-between items-center">
				<div className="title">
					<h4>Total Organizations: {organizationList?.length}</h4>
				</div>
				<Button type="button" onClick={() => setOpen(true)}>
					<Plus size={22} className="mr-4" /> Organization
				</Button>
			</div>
			<div className={pageStyles["workspace-content-grid-3"]}>
				{organizationList?.map((item, i) => {
					const { organization } = item;
					const { _count } = organization;
					return (
						<EntityItem
							key={generateKeyComp(`${organization.title}__${i}`)}
							icon={<Buildings size={84} />}
							linkBase={`/workspace/organizations/${organization.id}`}
							title={organization.title}
							firstStat={`Participants: ${_count?.organizationUsers}`}
							secondaryStat={`Teams: ${_count?.teams}`}
						/>
					);
				})}
			</div>
		</div>
	);
}
