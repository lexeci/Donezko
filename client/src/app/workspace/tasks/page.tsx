"use client";

import {
  ActionBlock,
  Checkbox,
  NotSelected,
  PageHeader,
  PageLayout,
  Select,
  TasksWindow,
} from "@/components/index";
import { useFetchProjects } from "@/hooks/project/useFetchProjects";
import { useFetchTasks } from "@/hooks/tasks/useFetchTasks";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useState } from "react";

import pageStyles from "@/app/page.module.scss";
import { useFetchOrgRole } from "@/src/hooks/organization/useFetchOrgRole";
import { useFetchTeamsByProject } from "@/src/hooks/team/useFetchTeamsByProject";
import { OrgRole } from "@/src/types/org.types";
import { AccessStatus } from "@/src/types/root.types";
import clsx from "clsx";
import styles from "./page.module.scss";

/**
 * Tasks component allows the user to filter and view tasks based on project,
 * team, and assignment status, with multiple view styles.
 *
 * It renders a header, filter controls, and the task list or appropriate fallback
 * messages depending on the selection and permissions.
 *
 * @returns {JSX.Element} Main component output
 */
export default function Tasks() {
  // State for filtering tasks assigned to the user
  const [selectedAvailable, setSelectedAvailable] = useState<boolean>(false);
  // State to toggle between Kanban and List views
  const [isList, setIsList] = useState<boolean>(false);
  // Currently selected project ID
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined
  );
  // Currently selected team ID
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined
  );

  const { organizationId } = useOrganization(); // Current organization context
  const { organizationRole } = useFetchOrgRole(organizationId); // User role in organization
  const { projects: projectsData } = useFetchProjects(organizationId); // Fetch projects list
  const { teamList: teamsData } = useFetchTeamsByProject(
    organizationId,
    selectedProject
  ); // Fetch teams by selected project
  const { taskList, setTaskList, handleRefetch } = useFetchTasks({
    organizationId,
    projectId: selectedProject,
    teamId: selectedTeam,
    available: selectedAvailable,
  }); // Fetch filtered tasks

  // Determine if user has administration permissions
  const canAdministrate =
    organizationRole &&
    (organizationRole.role === OrgRole.OWNER ||
      organizationRole.role === OrgRole.ADMIN);

  // Filter teams where user has active access or admin rights
  const teamList = teamsData?.inProject.filter((item) => {
    const access = item.teamUsers?.[0];
    return canAdministrate || access?.teamStatus === AccessStatus.ACTIVE;
  });

  // Filter projects where user has active access or admin rights
  const projectList = projectsData?.filter((item) => {
    const access = item.projectUsers?.[0];
    return canAdministrate || access?.projectStatus === AccessStatus.ACTIVE;
  });

  return (
    <PageLayout>
      <PageHeader
        pageTitle="Tasks"
        title="Manage your tasks"
        desc="This page is dedicated for managing tasks which are available for you."
      />
      <div className={styles["additional-blocks"]}>
        <ActionBlock>
          {/* Project selection dropdown */}
          {projectList && (
            <Select
              id="project-select"
              placeholder="Filter by Project"
              options={projectList.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
              onChange={(data) => setSelectedProject(data.target.value)}
              extra={styles.fields}
            />
          )}

          {/* Team selection dropdown */}
          {teamList && (
            <Select
              id="team-select"
              placeholder="Filter by Team"
              options={teamList.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
              onChange={(data) => setSelectedTeam(data.target.value)}
              extra={styles.fields}
            />
          )}

          {/* Checkbox to filter tasks assigned to current user */}
          <Checkbox
            id="team-select"
            label="Assigned to you"
            checked={selectedAvailable}
            onChange={() => setSelectedAvailable(!selectedAvailable)}
          />

          {/* View style selection */}
          <Select
            id="style-select"
            placeholder="Select view style"
            defaultValue="kanban"
            options={[
              { label: "Kanban", value: "kanban" },
              { label: "List", value: "list" },
            ]}
            onChange={(data) => {
              data.target.value === "list" ? setIsList(true) : setIsList(false);
            }}
            extra={clsx(styles.fields, "ml-auto")}
          />
        </ActionBlock>
      </div>

      {/* Render fallback if no project selected */}
      {!selectedProject ? (
        <NotSelected element="project" />
      ) : teamList && teamList?.length > 0 ? (
        // Render tasks window if teams exist for selected project
        <TasksWindow
          taskList={taskList}
          setTaskList={setTaskList}
          isPage
          isList={isList}
          projectId={selectedProject}
          handleRefetch={handleRefetch}
        />
      ) : (
        // Message shown if no teams in selected project
        <div className={pageStyles["workspace-not-found"]}>
          <h5>You don't have any teams in current project.</h5>
        </div>
      )}
    </PageLayout>
  );
}
