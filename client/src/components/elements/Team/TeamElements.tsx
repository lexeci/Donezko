"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem, ModalWindow } from "@/components/index";
import { useFetchUserTeams } from "@/src/hooks/team/useFetchUserTeams";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import TeamCreate from "./TeamCreate";

export default function TeamElements() {
	const { userTeamList: teamList } = useFetchUserTeams();
	const [open, setOpen] = useState<boolean>(false);

	console.log(teamList);

	return (
		<div className={pageStyles["workspace-content-col"]}>
			{open && (
				<ModalWindow
					title="Organization manager.exe"
					subtitle="The manager to operate your organization"
					onClose={() => setOpen(false)}
				>
					<TeamCreate />
				</ModalWindow>
			)}
			<div className="counter w-full flex flex-row justify-between items-center">
				<div className="title">
					<h4>Total Teams: {teamList?.length}</h4>
				</div>
				<Button type="button" onClick={() => setOpen(true)}>
					<Plus size={22} className="mr-4" /> Team
				</Button>
			</div>
			<div className={pageStyles["workspace-content-grid-3"]}>
				{teamList?.map((team, i) => {
					const { _count } = team;
					return (
						<EntityItem
							key={generateKeyComp(`${team.title}__${i}`)}
							icon={<Buildings size={84} />}
							linkBase={`/workspace/organization/${team.id}`}
							title={team.title}
							firstStat={`Participants: ${_count?.teamUsers}`}
							secondaryStat={`Tasks: ${_count?.tasks}`}
						/>
					);
				})}
			</div>
		</div>
	);
}
