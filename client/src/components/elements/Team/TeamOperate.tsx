"use client";

import { Button } from "@/components/index";
import { useLinkTeamToProject } from "@/src/hooks/team/useLinkTeamToProject";
import { useUnlinkTeamFromProject } from "@/src/hooks/team/useUnlinkTeamFromProject";
import { TeamsProjectResponse } from "@/src/types/team.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { AssignTeams } from "./OperateElements/AssignTeams";
import { ManageTeams } from "./OperateElements/ManageTeams";

interface TeamOperate {
	organizationId?: string | null;
	organizationTitle?: string;
	projectId?: string;
	projectTitle?: string;
	teams: TeamsProjectResponse;
	setTeamList?: Dispatch<SetStateAction<TeamsProjectResponse | undefined>>;
}

export default function TeamOperate({
	organizationId: localOrgId,
	organizationTitle: localOrgTitle,
	projectId: localProjectId,
	projectTitle: localProjectTitle,
	teams: localProjectTeams,
	setTeamList,
}: TeamOperate) {
	const [organizationId, setOrganizationId] = useState<string | null>(null);
	const [tabActive, setTabActive] = useState<"manage" | "assign">("manage");
	const [projectId, setProjectId] = useState<string | null>(null);

	const { linkTeamToProject } = useLinkTeamToProject();
	const { unlinkTeamFromProject } = useUnlinkTeamFromProject();

	useEffect(() => {
		localOrgId && setOrganizationId(localOrgId);
		localProjectId && setProjectId(localProjectId);
	}, [localOrgId]);

	const handleAssign = (teamId: string) => {
		if (projectId && organizationId && teamId && setTeamList) {
			linkTeamToProject(
				{
					id: teamId,
					projectId,
					organizationId,
				},
				{
					onSuccess: data => setTeamList(data),
				}
			);
		} else {
			toast.error("Something went wrong :(");
			console.error("The projectId and organizationId were not provided");
		}
	};

	const handleUnassign = (teamId: string) => {
		if (projectId && organizationId && teamId && setTeamList) {
			unlinkTeamFromProject(
				{
					id: teamId,
					projectId,
					organizationId,
				},
				{
					onSuccess: data => setTeamList(data),
				}
			);
		} else {
			toast.error("Something went wrong :(");
			console.error("The projectId and organizationId were not provided");
		}
	};

	return (
		<div className="container bg-background w-full h-full border border-foreground p-4 py-4 flex flex-col justify-start items-center gap-y-4">
			<div className="action-block flex flex-col gap-y-0.5 w-full border-4 border-foreground">
				<div className="title text-base font-semibold w-full border-b border-foreground px-2 py-2">
					<h4>Available actions:</h4>
				</div>
				<div className="container border-t border-foreground flex flex-row justify-start items-center w-full p-2 gap-x-4">
					<Button
						block
						negative
						type="button"
						onClick={() => setTabActive("manage")}
					>
						Manage Teams
					</Button>
					<Button
						block
						negative
						type="button"
						onClick={() => setTabActive("assign")}
					>
						Assign Teams
					</Button>
				</div>
			</div>

			<div className="tabs-container w-full border border-foreground p-4">
				{tabActive === "manage" && localProjectTitle && (
					<ManageTeams
						projectTitle={localProjectTitle}
						assignedTeams={localProjectTeams.inProject}
						handleUnassign={handleUnassign}
					/>
				)}

				{tabActive === "assign" && (
					<AssignTeams
						projectId={projectId}
						projectTitle={localProjectTitle}
						unAssignedTeams={localProjectTeams.notInProject}
						organizationId={organizationId}
						handleAssign={handleAssign}
					/>
				)}
			</div>
		</div>
	);
}
