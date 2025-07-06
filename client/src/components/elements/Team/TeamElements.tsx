"use client";

import pageStyles from "@/app/page.module.scss";
import styles from "./Team.module.scss";

import {
  Button,
  EntityItem,
  LackPermission,
  ModalWindow,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useFetchTeams } from "@/hooks/team/useFetchTeams";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import { TeamsProjectResponse, TeamsResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { CoinVertical, Plus, UserList } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TeamCreate from "./TeamCreate";
import TeamOperate from "./TeamOperate";

/**
 * Props for the TeamElements component.
 * @typedef {Object} TeamElementsProps
 * @property {boolean} [isWindowElement] - Whether the component is rendered in a window-style element.
 * @property {string} [organizationId] - The ID of the organization.
 * @property {string} [organizationTitle] - The name/title of the organization.
 * @property {TeamsResponse[]} [teams] - Optional list of teams (for static use).
 * @property {string} [projectId] - ID of the current project (for project-based team mode).
 * @property {string} [projectTitle] - Title of the current project.
 * @property {TeamsProjectResponse} [projectTeams] - Team assignment data for a project.
 * @property {boolean} [isAdministrate] - Whether the user can administrate explicitly.
 * @property {Dispatch<SetStateAction<TeamsProjectResponse | undefined>>} [setTeamList] - Setter to update team list (for project mode).
 */
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

/**
 * Renders a list of teams using EntityItem.
 *
 * @component
 * @param {Object} props - Props for the component.
 * @param {TeamsResponse[] | undefined} props.teamsData - List of teams.
 * @param {Function} props.onCountChange - Callback to update team count.
 * @param {boolean} [props.canAdministrate] - Whether the user has admin access.
 * @returns {JSX.Element}
 */
const TeamElementsList = ({
  teamsData,
  onCountChange,
  canAdministrate,
}: {
  teamsData: TeamsResponse[] | undefined;
  onCountChange: (count: number) => void;
  canAdministrate?: boolean;
}) => {
  useEffect(() => {
    onCountChange(teamsData?.length || 0);
  }, [teamsData, onCountChange]);

  return teamsData?.length ? (
    teamsData.map((team, i) => {
      const access = team.teamUsers?.[0];
      const isGranted =
        canAdministrate || access?.teamStatus === AccessStatus.ACTIVE;

      return (
        team.title && (
          <EntityItem
            key={generateKeyComp(`${team.title}__${i}`)}
            icon={<UserList size={84} />}
            linkBase={`${DASHBOARD_PAGES.TEAMS}/${team.id}`}
            title={team.title}
            firstStat={`Participants: ${team._count?.teamUsers}`}
            secondaryStat={`Tasks: ${team._count?.tasks}`}
            hideLink={!isGranted}
          />
        )
      );
    })
  ) : (
    <div className={styles["not-found"]}>
      <h5>There is no teams for you</h5>
    </div>
  );
};

/**
 * Component to display and manage teams within an organization or project.
 *
 * @component
 * @param {TeamElementsProps} props - Props for the component.
 * @returns {JSX.Element}
 */
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

  /**
   * Determines if the user has administrative rights over teams.
   * Uses either direct prop or organization role.
   */
  const canAdministrate =
    isAdministrate ??
    (organizationRole &&
      (organizationRole.role === OrgRole.OWNER ||
        organizationRole.role === OrgRole.ADMIN));

  /**
   * Loads the list of teams if not provided via props.
   */
  const { teamList, setTeamList: setTeamsLocal } = useFetchTeams(
    organizationRole
      ? organizationRole.role !== OrgRole.VIEWER
        ? effectiveOrganizationId
        : null
      : null
  );

  /**
   * Decides which teams list is active — local, project-based or fetched.
   */
  const effectiveTeams = teams ?? projectTeams?.inProject ?? teamList;

  /**
   * Callback to handle adding a newly created team to the list.
   *
   * @param {TeamsResponse} newTeam - The new team to add.
   */
  const handleNewTeam = (newTeam: TeamsResponse) => {
    !teams && !projectTeams?.inProject
      ? setTeamsLocal((prevState) => prevState && [...prevState, newTeam])
      : effectiveTeams && effectiveTeams.push(newTeam);

    setTeamCount((prev) => prev + 1); // Update team count
  };

  // UI rendering
  return organizationRole ? (
    organizationRole.role === OrgRole.VIEWER ? (
      <LackPermission />
    ) : (
      <div
        className={clsx(
          pageStyles["workspace-content-col"],
          isWindowElement && styles["window-element"]
        )}
      >
        {/* Modal for creating new team */}
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

        {/* Modal for assigning teams to a project */}
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

        {/* Header with team count */}
        <div className={pageStyles["workspace-basic-counter"]}>
          <div
            className={clsx(
              "title",
              isWindowElement && styles["window-element-team"]
            )}
          >
            <h4>Total Teams: {teamCount}</h4>
          </div>

          {/* Add team button */}
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

        {/* Teams list */}
        <div
          className={clsx(
            pageStyles["workspace-content-grid-3"],
            isWindowElement && "!p-0"
          )}
        >
          <TeamElementsList
            teamsData={effectiveTeams}
            onCountChange={setTeamCount}
            canAdministrate={canAdministrate}
          />
        </div>
      </div>
    )
  ) : (
    // Fallback UI if role not loaded
    <div className={pageStyles["workspace-not-loaded-coin"]}>
      <CoinVertical size={80} />
    </div>
  );
}
