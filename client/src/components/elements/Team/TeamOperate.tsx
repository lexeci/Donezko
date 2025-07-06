"use client";

import { ActionBlock, Button } from "@/components/index";
import { useLinkTeamToProject } from "@/hooks/team/useLinkTeamToProject";
import { useUnlinkTeamFromProject } from "@/hooks/team/useUnlinkTeamFromProject";
import { TeamsProjectResponse } from "@/types/team.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { AssignTeams } from "./OperateElements/AssignTeams";
import { ManageTeams } from "./OperateElements/ManageTeams";

import styles from "./Team.module.scss";

interface TeamOperate {
  /** Organization ID (optional) */
  organizationId?: string | null;

  /** Organization title (optional) */
  organizationTitle?: string;

  /** Project ID (optional) */
  projectId?: string;

  /** Project title (optional) */
  projectTitle?: string;

  /** Teams related to the project */
  teams: TeamsProjectResponse;

  /** Setter function to update team list state */
  setTeamList?: Dispatch<SetStateAction<TeamsProjectResponse | undefined>>;
}

/**
 * TeamOperate component provides UI and logic for managing
 * team assignments to a project.
 *
 * Allows switching between two tabs:
 * - Manage Teams: to unassign teams from a project
 * - Assign Teams: to assign new teams to a project
 *
 * @param {TeamOperate} props - component props
 * @returns JSX.Element
 */
export default function TeamOperate({
  organizationId: localOrgId,
  organizationTitle: localOrgTitle,
  projectId: localProjectId,
  projectTitle: localProjectTitle,
  teams: localProjectTeams,
  setTeamList,
}: TeamOperate) {
  // Local state for organizationId (nullable string)
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // State to track which tab is active: "manage" or "assign"
  const [tabActive, setTabActive] = useState<"manage" | "assign">("manage");

  // Local state for projectId (nullable string)
  const [projectId, setProjectId] = useState<string | null>(null);

  // Custom hooks for linking/unlinking teams to/from projects
  const { linkTeamToProject } = useLinkTeamToProject();
  const { unlinkTeamFromProject } = useUnlinkTeamFromProject();

  // Sync local organizationId and projectId state with props on mount or when props change
  useEffect(() => {
    if (localOrgId) setOrganizationId(localOrgId);
    if (localProjectId) setProjectId(localProjectId);
  }, [localOrgId, localProjectId]);

  /**
   * Handles assigning a team to the current project.
   * Calls linkTeamToProject hook and updates team list on success.
   *
   * @param {string} teamId - ID of the team to assign
   */
  const handleAssign = (teamId: string) => {
    if (projectId && organizationId && teamId && setTeamList) {
      linkTeamToProject(
        {
          id: teamId,
          projectId,
          organizationId,
        },
        {
          onSuccess: (data) => setTeamList(data),
        }
      );
    } else {
      toast.error("Something went wrong :(");
      console.error("The projectId and organizationId were not provided");
    }
  };

  /**
   * Handles unassigning a team from the current project.
   * Calls unlinkTeamFromProject hook and updates team list on success.
   *
   * @param {string} teamId - ID of the team to unassign
   */
  const handleUnassign = (teamId: string) => {
    if (projectId && organizationId && teamId && setTeamList) {
      unlinkTeamFromProject(
        {
          id: teamId,
          projectId,
          organizationId,
        },
        {
          onSuccess: (data) => setTeamList(data),
        }
      );
    } else {
      toast.error("Something went wrong :(");
      console.error("The projectId and organizationId were not provided");
    }
  };

  return (
    <div className={styles["team-operate"]}>
      {/* Tab selection buttons */}
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

      {/* Render tabs content conditionally based on active tab */}
      <div className={styles["tabs-container"]}>
        {/* Manage Teams tab - shows assigned teams and unassign handler */}
        {tabActive === "manage" && localProjectTitle && (
          <ManageTeams
            projectTitle={localProjectTitle}
            assignedTeams={localProjectTeams.inProject}
            handleUnassign={handleUnassign}
          />
        )}

        {/* Assign Teams tab - shows teams not assigned to project and assign handler */}
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
