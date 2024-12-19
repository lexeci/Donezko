"use client";

import pageStyles from "@/app/page.module.scss";

import { Button, EntityItem, ModalWindow } from "@/components/index";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchOrgRole } from "@/src/hooks/organization/useFetchOrgRole";
import { useFetchTeams } from "@/src/hooks/team/useFetchTeams";
import { TeamsProjectResponse, TeamsResponse } from "@/src/types/team.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Plus, UserList } from "@phosphor-icons/react/dist/ssr";
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

// Компонента для відображення команд, якщо передано `teams` через пропси
const TeamElementsWithData = ({
	fetchedData,
	onCountChange,
}: {
	fetchedData: TeamsResponse[];
	onCountChange: (count: number) => void;
}) => {
	// Викликаємо `onCountChange` через ефект
	useEffect(() => {
		if (fetchedData?.length) {
			onCountChange(fetchedData.length);
		}
	}, [fetchedData, onCountChange]);

	return fetchedData.length > 0 ? (
		fetchedData.map((team, i) => {
			const { _count, id, title } = team;
			return (
				title && (
					<EntityItem
						key={generateKeyComp(`${title}__${i}`)}
						icon={<UserList size={84} />}
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
	organizationId,
}: {
	onCountChange: (count: number) => void;
	organizationId: string | null;
}) => {
	const { teamList } = useFetchTeams(organizationId);

	// Викликаємо `onCountChange` через ефект
	useEffect(() => {
		if (teamList?.length) {
			onCountChange(teamList.length);
		}
	}, [teamList, onCountChange]);

	return teamList && teamList.length > 0 ? (
		teamList?.map((team, i) => {
			const { id, title, _count } = team;
			return (
				<EntityItem
					key={generateKeyComp(`${title}__${i}`)}
					icon={<UserList size={84} />}
					linkBase={`/workspace/teams/${id}`}
					title={title}
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
	organizationId: localId,
	organizationTitle,
	projectId,
	projectTitle,
	teams,
	projectTeams,
	isAdministrate,
	setTeamList,
}: TeamElementsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [openAssign, setOpenAssign] = useState<boolean>(false);
	const [teamCount, setTeamCount] = useState<number>(teams?.length || 0);

	// Якщо `organizationId` передано, використовуємо його, інакше виконуємо запит
	const { organizationId } = useOrganization();
	const effectiveOrganizationId = localId || organizationId;

	// Якщо `isAdministrate` передано, використовуємо його, інакше перевіряємо роль
	const { organizationRole } = useFetchOrgRole(organizationId);

	// Визначаємо, чи може користувач адміністративно діяти
	const canAdministrate =
		isAdministrate !== undefined
			? isAdministrate
			: organizationRole && organizationRole.role !== "VIEWER"; // Виключення для VIEWER

	return (
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
						onClick={() => (projectTeams ? setOpenAssign(true) : setOpen(true))}
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
				{teams?.length || teams != undefined ? (
					<TeamElementsWithData
						fetchedData={teams}
						onCountChange={setTeamCount}
					/>
				) : projectTeams?.inProject?.length || projectTeams != undefined ? (
					<TeamElementsWithData
						fetchedData={projectTeams.inProject}
						onCountChange={setTeamCount}
					/>
				) : (
					<TeamElementsWithoutData
						organizationId={effectiveOrganizationId}
						onCountChange={setTeamCount}
					/>
				)}
			</div>
		</div>
	);
}
