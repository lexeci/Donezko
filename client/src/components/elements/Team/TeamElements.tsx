"use client";

import pageStyles from "@/app/page.module.scss";

import {
	Button,
	EntityItem,
	LackPermission,
	ModalWindow,
} from "@/components/index";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchOrgRole } from "@/src/hooks/organization/useFetchOrgRole";
import { useFetchTeams } from "@/src/hooks/team/useFetchTeams";
import { OrgRole } from "@/src/types/org.types";
import { TeamsProjectResponse, TeamsResponse } from "@/src/types/team.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { CoinVertical, Plus, UserList } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TeamCreate from "./TeamCreate";
import TeamOperate from "./TeamOperate";

interface TeamElementsProps {
	isWindowElement?: boolean;
	organizationId?: string;
	organizationTitle?: string;
	teams?: TeamsResponse[];
	projectId?: string;
	projectTitle?: string;
	projectTeams?: TeamsProjectResponse;
	isAdministrate?: boolean;
	setTeamList?: Dispatch<SetStateAction<TeamsProjectResponse | undefined>>;
}

const TeamElementsList = ({
	teamsData,
	onCountChange,
}: {
	teamsData: TeamsResponse[] | undefined;
	onCountChange: (count: number) => void;
}) => {
	useEffect(() => {
		onCountChange(teamsData?.length || 0);
	}, [teamsData, onCountChange]);

	return teamsData?.length ? (
		teamsData.map(
			(team, i) =>
				team.title && (
					<EntityItem
						key={generateKeyComp(`${team.title}__${i}`)}
						icon={<UserList size={84} />}
						linkBase={`/workspace/teams/${team.id}`}
						title={team.title}
						firstStat={`Participants: ${team._count?.teamUsers}`}
						secondaryStat={`Tasks: ${team._count?.tasks}`}
					/>
				)
		)
	) : (
		<div className="w-full h-full bg-background p-8">
			<h5 className="font-bold text-base">There is no teams for you</h5>
		</div>
	);
};

export default function TeamElements({
	isWindowElement,
	organizationId: localId,
	organizationTitle,
	projectId,
	projectTitle,
	teams,
	projectTeams,
	isAdministrate,
	setTeamList,
}: TeamElementsProps) {
	const [open, setOpen] = useState(false);
	const [openAssign, setOpenAssign] = useState(false);
	const [teamCount, setTeamCount] = useState<number>(teams?.length || 0);

	const { organizationId } = useOrganization();
	const effectiveOrganizationId = localId || organizationId;

	const { organizationRole } = useFetchOrgRole(effectiveOrganizationId);

	// Визначаємо, чи може користувач адміністративно діяти
	const canAdministrate =
		isAdministrate !== undefined
			? isAdministrate
			: organizationRole &&
			  (organizationRole.role === "OWNER" ||
					organizationRole.role === "ADMIN");

	// Використовуємо `useFetchTeams`, якщо `teams` і `setTeamList` не передано
	const { teamList, setTeamList: setTeamsLocal } = useFetchTeams(
		organizationRole
			? organizationRole.role !== OrgRole.VIEWER
				? effectiveOrganizationId
				: null
			: null
	);
	const effectiveTeams = teams ?? projectTeams?.inProject ?? teamList;

	const handleNewTeam = (newTeam: TeamsResponse) => {
		!teams && !projectTeams?.inProject
			? setTeamsLocal(prevState => prevState && [...prevState, newTeam])
			: effectiveTeams && effectiveTeams.push(newTeam);

		setTeamCount(prev => prev + 1); // Оновлюємо кількість команд
	};

	return organizationRole ? (
		organizationRole.role === OrgRole.VIEWER ? (
			<LackPermission />
		) : (
			<div
				className={clsx(
					pageStyles["workspace-content-col"],
					isWindowElement && "h-full w-full max-w-full !p-0 !justify-start"
				)}
			>
				{open && canAdministrate && (
					<ModalWindow
						title="Teams manager.exe"
						subtitle="The manager to operate your teams"
						onClose={() => setOpen(false)}
					>
						<TeamCreate
							organizationId={effectiveOrganizationId}
							organizationTitle={organizationTitle}
							setTeams={handleNewTeam}
						/>
					</ModalWindow>
				)}
				{openAssign && canAdministrate && projectTeams && (
					<ModalWindow
						title="Teams manager.exe"
						subtitle={`The manager to operate your teams in ${projectTitle}`}
						onClose={() => setOpenAssign(false)}
					>
						<TeamOperate
							organizationId={effectiveOrganizationId}
							organizationTitle={organizationTitle}
							projectId={projectId}
							projectTitle={projectTitle}
							teams={projectTeams}
							setTeamList={setTeamList}
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
					{canAdministrate && (
						<Button
							type="button"
							onClick={() =>
								projectTeams ? setOpenAssign(true) : setOpen(true)
							}
							negative
							block
						>
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
					<TeamElementsList
						teamsData={effectiveTeams}
						onCountChange={setTeamCount}
					/>
				</div>
			</div>
		)
	) : (
		<div className="h-full flex justify-center items-center">
			<CoinVertical size={80} className="m-auto animate-spin" />
		</div>
	);
}
