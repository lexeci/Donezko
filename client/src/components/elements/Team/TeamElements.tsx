"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem, ModalWindow } from "@/components/index";
import { useFetchUserTeams } from "@/src/hooks/team/useFetchUserTeams";
import { TeamResponse } from "@/src/types/team.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { useEffect, useState } from "react";
import TeamCreate from "./TeamCreate";

interface TeamElementsProps {
	isWindowElement?: boolean;
	organizationId?: string;
	organizationTitle?: string;
	teams?: TeamResponse[];
}

// Компонента для відображення команд, якщо передано `teams` через пропси
const TeamElementsWithData = ({ teams }: { teams: TeamResponse[] }) => {
	return teams.map((team, i) => {
		const { _count } = team;
		return (
			<EntityItem
				key={generateKeyComp(`${team.title}__${i}`)}
				icon={<Buildings size={84} />}
				linkBase={`/workspace/teams/${team.id}`}
				title={team.title}
				firstStat={`Participants: ${_count?.teamUsers}`}
				secondaryStat={`Tasks: ${_count?.tasks}`}
			/>
		);
	});
};

// Компонента для відображення команд, якщо дані не передано через пропси
const TeamElementsWithoutData = ({
	onCountChange,
}: {
	onCountChange: (count: number) => void;
}) => {
	const { userTeamList: teamList } = useFetchUserTeams();

	// Викликаємо `onCountChange` через ефект
	useEffect(() => {
		if (teamList?.length) {
			onCountChange(teamList.length);
		}
	}, [teamList, onCountChange]);

	return teamList?.map((team, i) => {
		const { _count } = team;
		return (
			<EntityItem
				key={generateKeyComp(`${team.title}__${i}`)}
				icon={<Buildings size={84} />}
				linkBase={`/workspace/teams/${team.id}`}
				title={team.title}
				firstStat={`Participants: ${_count?.teamUsers}`}
				secondaryStat={`Tasks: ${_count?.tasks}`}
			/>
		);
	});
};

export default function TeamElements({
	isWindowElement,
	organizationId,
	organizationTitle,
	teams,
}: TeamElementsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [teamCount, setTeamCount] = useState<number>(teams?.length || 0);

	return (
		<div
			className={clsx(
				pageStyles["workspace-content-col"],
				isWindowElement && "h-full w-full max-w-full !p-0 !justify-start"
			)}
		>
			{open && (
				<ModalWindow
					title="Organization manager.exe"
					subtitle="The manager to operate your organization"
					onClose={() => setOpen(false)}
				>
					<TeamCreate
						organizationId={organizationId}
						organizationTitle={organizationTitle}
					/>
				</ModalWindow>
			)}
			<div className="counter w-full flex flex-row justify-between items-center">
				<div
					className={clsx(
						"title",
						isWindowElement &&
							"py-2 px-4 bg-background border border-foreground"
					)}
				>
					<h4>Total Teams: {teamCount}</h4>
				</div>
				<Button type="button" onClick={() => setOpen(true)} negative block>
					<Plus size={22} className="mr-4" /> Team
				</Button>
			</div>
			<div
				className={clsx(
					pageStyles["workspace-content-grid-3"],
					isWindowElement && "!p-0"
				)}
			>
				{teams?.length || teams != undefined ? (
					<TeamElementsWithData teams={teams} />
				) : (
					<TeamElementsWithoutData onCountChange={setTeamCount} />
				)}
			</div>
		</div>
	);
}
