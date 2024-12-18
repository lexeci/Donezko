"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem } from "@/components/index";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import OrganizationModal from "./OrganizationModal";

export default function OrganizationElements() {
	const { organizationList } = useFetchOrgs();
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className={pageStyles["workspace-content-col"]}>
			{open && <OrganizationModal setOpen={setOpen} />}
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
