"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem, ModalWindow } from "@/components/index";
import { useFetchUserTeams } from "@/src/hooks/team/useFetchUserTeams";
import { ProjectTeam } from "@/src/types/project.types";
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
	teams?: TeamResponse[] | ProjectTeam[];
	isAdministrate?: boolean;
}

// Компонента для відображення команд, якщо передано `teams` через пропси
const TeamElementsWithData = ({
	fetchedData,
}: {
	fetchedData: TeamResponse[] | ProjectTeam[];
}) => {
	return fetchedData.length > 0 ? (
		fetchedData.map((item, i) => {
			// Динамічна перевірка на тип
			const isTeamResponse = (
				team: TeamResponse | ProjectTeam
			): team is TeamResponse => "title" in team;

			const team = isTeamResponse(item) ? item : item.team;
			const { _count, id, title } = team;

			return (
				title && (
					<EntityItem
						key={generateKeyComp(`${title}__${i}`)}
						icon={<Buildings size={84} />}
						linkBase={`/workspace/teams/${id}`}
						title={title}
						firstStat={`Participants: ${_count?.teamUsers}`}
						secondaryStat={`Tasks: ${_count?.tasks}`}
					/>
				)
			);
		})
	) : (
		<div className="w-full h-full bg-background p-8">
			<h5 className="font-bold text-base">There is no teams for you</h5>
		</div>
	);
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

	return teamList && teamList.length > 0 ? (
		teamList?.map((team, i) => {
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
		})
	) : (
		<div className="w-full h-full bg-background p-8">
			<h5 className="font-bold text-base">There is no teams for you</h5>
		</div>
	);
};

export default function TeamElements({
	isWindowElement,
	organizationId,
	organizationTitle,
	teams,
	isAdministrate = false,
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
			{open && isAdministrate && (
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
				{isAdministrate && (
					<Button type="button" onClick={() => setOpen(true)} negative block>
						<Plus size={22} className="mr-4" /> Team
					</Button>
				)}
			</div>
			<div
				className={clsx(
					pageStyles["workspace-content-grid-3"],
					isWindowElement && "!p-0"
				)}
			>
				{teams?.length || teams != undefined ? (
					<TeamElementsWithData fetchedData={teams} />
				) : (
					<TeamElementsWithoutData onCountChange={setTeamCount} />
				)}
			</div>
		</div>
	);
}
