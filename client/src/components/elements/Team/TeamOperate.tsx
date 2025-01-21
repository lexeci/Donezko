"use client";

import {ActionBlock, Button} from "@/components/index";
import {useLinkTeamToProject} from "@/hooks/team/useLinkTeamToProject";
import {useUnlinkTeamFromProject} from "@/hooks/team/useUnlinkTeamFromProject";
import {TeamsProjectResponse} from "@/types/team.types";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {toast} from "sonner";
import {AssignTeams} from "./OperateElements/AssignTeams";
import {ManageTeams} from "./OperateElements/ManageTeams";

import styles from "./Team.module.scss";

interface TeamOperate {
    organizationId?: string | null;
    organizationTitle?: string;
    projectId?: string;
    projectTitle?: string;
    teams: TeamsProjectResponse;
    setTeamList?: Dispatch<SetStateAction<TeamsProjectResponse | undefined>>;
}

export default function TeamOperate(
    {
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

    const {linkTeamToProject} = useLinkTeamToProject();
    const {unlinkTeamFromProject} = useUnlinkTeamFromProject();

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
        <div className={styles["team-operate"]}>
            <ActionBlock>
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
            </ActionBlock>

            <div className={styles["tabs-container"]}>
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
