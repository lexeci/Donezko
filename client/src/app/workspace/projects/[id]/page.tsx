"use client";

import pageStyles from "@/app/page.module.scss";
import {
  ActionBlock,
  AddProjectUsers,
  Button,
  LackPermission,
  ModalWindow,
  NotFoundId,
  PageHeader,
  PageLayout,
  ProjectUpdate,
  ProjectUsers,
  TeamElements,
  WindowContainer,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useDeleteProject } from "@/hooks/project/useDeleteProject";
import { useFetchProjectById } from "@/hooks/project/useFetchProjectById";
import { useFetchTeamsByProject } from "@/hooks/team/useFetchTeamsByProject";
import { useExitProject } from "@/src/hooks/project/useExitProject";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole } from "@/src/types/org.types";
import { ProjectRole } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Project page component renders detailed information and management options
 * for a single project, including teams, users, and project settings.
 *
 * Handles permissions for updating, managing users, deleting, or exiting the project.
 *
 * @returns {JSX.Element} The project page content or fallback components based on data or permissions.
 */
export default function Project() {
  const { replace } = useRouter(); // Navigation method to replace current URL
  const { organizationId } = useOrganization(); // Get current organization ID from context

  // State for controlling modal windows visibility
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [openModalAddUser, setOpenModalAddUser] = useState<boolean>(false);
  const [openModalUser, setOpenModalUser] = useState<boolean>(false);

  // Extract project ID from URL parameters
  const params = useParams<{ id: string }>();
  const { id: projectId } = params;

  // Fetch project data by projectId and organizationId with refetch handler
  const { project: fetchedData, handleRefetch } = useFetchProjectById(
    projectId,
    organizationId
  );
  const { deleteProject } = useDeleteProject(); // Hook to delete project
  const { exitProject } = useExitProject(); // Hook to exit project

  // Extract relevant data from fetched project data
  const userId = fetchedData?.userId;
  const project = fetchedData?.project;
  const projectStatus = fetchedData?.projectStatus;
  const projectRole = fetchedData?.role;
  const role = fetchedData?.user?.organizationUsers[0].role;
  const organization = project?.organization;

  // Fetch the list of teams associated with the project
  const { teamList, setTeamList } = useFetchTeamsByProject(
    organizationId,
    projectId
  );

  // Determine if current user has permission to update/manage the project
  const hasPermission =
    role === OrgRole.ADMIN ||
    role === OrgRole.OWNER ||
    projectRole === ProjectRole.MANAGER;

  // Determine if user has organization-wide admin/owner permissions
  const isOrgPermission = role === OrgRole.ADMIN || role === OrgRole.OWNER;

  /**
   * Handler to exit the project for the current user.
   * Calls exitProject hook and redirects to home on success.
   */
  const handleExit = () => {
    userId &&
      organizationId &&
      exitProject(
        {
          projectId,
          userId,
          organizationId,
        },
        {
          onSuccess: () => {
            replace(DASHBOARD_PAGES.HOME);
          },
        }
      );
  };

  // Conditional rendering based on project data existence and access status
  return project ? (
    projectStatus === AccessStatus.ACTIVE ? (
      <PageLayout>
        {/* Header showing project info and action button if permitted */}
        <PageHeader
          pageTitle="Project"
          title={project.title as string}
          desc={project.description as string}
          extraDesc={
            project &&
            `Teams: ${project._count?.projectTeams} | Tasks: ${project._count?.tasks}`
          }
          extraInfo={organization && `Organization: ${organization.title}`}
          button={hasPermission && "Update Project"}
          buttonAction={() => hasPermission && setOpenModalUpdate(true)}
        />

        <div className={pageStyles["workspace-content-col"]}>
          {/* Action buttons for managing users, shown if user has permission */}
          {hasPermission && (
            <ActionBlock>
              <Button
                block
                negative
                type="button"
                onClick={() => setOpenModalUser(true)}
              >
                Manage user
              </Button>
              {/* Add user button only for organization admins/owners */}
              {isOrgPermission && (
                <Button
                  block
                  negative
                  type="button"
                  onClick={() => setOpenModalAddUser(true)}
                >
                  Add user
                </Button>
              )}
            </ActionBlock>
          )}

          {/* Window container showing teams associated with the project */}
          <WindowContainer
            title={project.title as string}
            subtitle={`Teams: ${teamList?.inProject.length}`}
            fullPage
          >
            {teamList && organizationId && (
              <TeamElements
                isWindowElement
                organizationId={organizationId}
                organizationTitle={organization?.title}
                projectId={projectId}
                projectTitle={project.title}
                projectTeams={teamList}
                isAdministrate={
                  role === OrgRole.ADMIN || role === OrgRole.OWNER
                }
                setTeamList={setTeamList}
              />
            )}
          </WindowContainer>

          {/* Action buttons for deleting or exiting the project */}
          <div className={pageStyles["workspace-actions"]}>
            {/* Delete project button shown only to org admins/owners */}
            {isOrgPermission && (
              <Button type="button" onClick={() => setOpenModal(true)}>
                <Trash size={22} className="mr-4" /> Delete Project
              </Button>
            )}
            {/* Exit project button shown for non-org admins/owners */}
            {!isOrgPermission && (
              <Button type="button" onClick={() => handleExit()}>
                <Trash size={22} className="mr-4" />
                Exit organization
              </Button>
            )}
          </div>

          {/* Modal for confirming project deletion */}
          {openModal && (
            <ModalWindow
              title="Program to ask of sure action.exe"
              subtitle="Hey do you really know what you are doing ?"
              onClose={() => setOpenModal(false)}
            >
              <div className={pageStyles["workspace-modal-container"]}>
                <div className={pageStyles["workspace-modal-container__desc"]}>
                  <h1>Hey did you know?</h1>
                  <p>
                    If you proceed on this action you will delete tasks and
                    assigns of teams which are related to this project. Make
                    sure that you understand that.
                  </p>
                </div>
                <div
                  className={
                    pageStyles["workspace-modal-container__btn-container"]
                  }
                >
                  <Button
                    type="button"
                    onClick={() =>
                      organizationId &&
                      deleteProject(
                        { projectId, organizationId },
                        {
                          onSuccess: () => replace(DASHBOARD_PAGES.PROJECTS),
                        }
                      )
                    }
                  >
                    <Trash
                      size={22}
                      className={pageStyles["workspace-modal-container__ico"]}
                    />{" "}
                    Delete
                  </Button>
                </div>
              </div>
            </ModalWindow>
          )}

          {/* Modal for updating project details */}
          {openModalUpdate && (
            <ModalWindow
              title="Update Project.exe"
              subtitle="It's time to update :()"
              onClose={() => setOpenModalUpdate(false)}
            >
              {organization && organizationId && (
                <div className={pageStyles["workspace-modal-container"]}>
                  <ProjectUpdate
                    id={projectId}
                    organizationId={organizationId}
                    data={project}
                    pullCloseModal={setOpenModalUpdate}
                    pullUpdatedData={handleRefetch}
                  />
                </div>
              )}
            </ModalWindow>
          )}

          {/* Modal for adding users to the project */}
          {openModalAddUser && (
            <ModalWindow
              title="Add user to project.exe"
              subtitle="Someone will have work to do ;)"
              onClose={() => setOpenModalAddUser(false)}
            >
              {organization && organizationId && (
                <AddProjectUsers
                  organizationId={organizationId}
                  projectId={projectId}
                />
              )}
            </ModalWindow>
          )}

          {/* Modal for managing project users */}
          {openModalUser && (
            <ModalWindow
              title="Manage project user.exe"
              subtitle="Administrate your users within project"
              onClose={() => setOpenModalUser(false)}
            >
              {organization && organizationId && (
                <ProjectUsers projectId={projectId} role={role} />
              )}
            </ModalWindow>
          )}
        </div>
      </PageLayout>
    ) : (
      // Show lack of permission message if project is not active
      <LackPermission />
    )
  ) : (
    // Show not found message if project ID is invalid or data not found
    <NotFoundId elementTitle="Project" />
  );
}
