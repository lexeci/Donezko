"use client";

import pageStyles from "@/app/page.module.scss";
import {
  Button,
  LackPermission,
  ModalWindow,
  OrganizationUpdate,
  OrganizationUsers,
  PageHeader,
  PageLayout,
  ProjectElements,
  TeamElements,
  WindowContainer,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useDeleteOrg } from "@/hooks/organization/useDeleteOrg";
import { useExitOrg } from "@/hooks/organization/useExitOrg";
import { useFetchOrgById } from "@/hooks/organization/useFetchOrgById";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole, OrgUserResponse } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Organization page component renders detailed information and controls for a single organization.
 *
 * It fetches organization data, user roles, and permissions,
 * then displays projects, teams, participants, and management options conditionally.
 *
 * Handles exiting and deleting organizations with confirmation modals.
 *
 * @returns {JSX.Element} The organization management page content
 */
export default function Organization() {
  const { replace } = useRouter(); // Router method for navigation replacement
  const { organizationId: cookieOrgId, saveOrganization } = useOrganization();
  // State to control visibility of delete confirmation modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  // State to control visibility of update organization modal
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  // Get organizationId from URL params
  const params = useParams<{ id: string }>();
  const { id: organizationId } = params;

  // Fetch organization data by ID and setter for updating local data
  const { organization: fetchedData, setOrganization } =
    useFetchOrgById(organizationId);

  // Fetch current user's role in the organization
  const { organizationRole } = useFetchOrgRole(organizationId);
  const role = organizationRole?.role ?? OrgRole.VIEWER; // Default to VIEWER if undefined
  const status = organizationRole?.status ?? AccessStatus.BANNED; // Default to BANNED if undefined

  const { deleteOrganization } = useDeleteOrg(); // Hook to handle deleting org
  const { exitOrganization } = useExitOrg(); // Hook to handle exiting org

  // Extract organization entity from fetched data
  const organization = fetchedData?.organization;

  // Local state to hold list of users in the organization
  const [organizationUsers, setOrganizationUsers] = useState<
    OrgUserResponse[] | undefined
  >(undefined);

  /**
   * Handler for exiting the organization.
   * Calls exitOrganization hook and clears saved organization in context.
   */
  const handleExit = () => {
    exitOrganization(organizationId);
    saveOrganization(null);
  };

  /**
   * Effect to update local organizationUsers state when organization data changes.
   */
  useEffect(() => {
    organization && setOrganizationUsers(organization?.organizationUsers);
  }, [organization]);

  /**
   * Effect to redirect user if organizationId param does not match saved org ID in context.
   */
  useEffect(() => {
    organizationId !== cookieOrgId &&
      replace(`${DASHBOARD_PAGES.ORGANIZATIONS}/${cookieOrgId}`);
  }, [cookieOrgId]);

  // Determine if user has admin or owner permissions
  const hasPermission = role === OrgRole.ADMIN || role === OrgRole.OWNER;

  return (
    <PageLayout>
      <PageHeader
        pageTitle="Organization" // Section main title
        title={organization?.title as string} // Organization name
        desc={`${organization?.description}`} // Organization description
        // Extra description showing counts of participants, teams, and projects
        extraDesc={`Participants: ${organization?._count?.organizationUsers} | Teams: ${organization?._count?.teams} | Projects: ${organization?._count?.projects}`}
        // Show join code only if user has permission
        joinCode={hasPermission && organization?.joinCode}
        // Show update button only if user is owner
        button={role === OrgRole.OWNER && "Update Organization"}
        // Button action opens update modal only for owner role
        buttonAction={() => role === OrgRole.OWNER && setOpenModalUpdate(true)}
      />
      {/* Render lack of permission notice and exit button for viewers or banned users */}
      {role === OrgRole.VIEWER || status === AccessStatus.BANNED ? (
        <>
          <LackPermission />
          <div className="mb-4">
            <Button type="button" onClick={() => handleExit()}>
              <Trash size={22} className="mr-4" />
              Exit organization
            </Button>
          </div>
        </>
      ) : (
        // Main content area for permitted users: projects, teams, users management
        <div className={pageStyles["workspace-content-col"]}>
          <WindowContainer
            title={organization?.title as string} // Window title is org name
            subtitle={`Projects: ${organization?._count?.projects}`} // Subtitle with projects count
            fullPage
          >
            {/* Render projects if available */}
            {fetchedData?.organization.projects && (
              <ProjectElements
                isWindowElement
                organizationId={organizationId}
                isAdministrate={hasPermission} // Pass if user can administrate
              />
            )}
          </WindowContainer>
          <WindowContainer
            title={organization?.title as string} // Window title is org name
            subtitle={`Teams: ${organization?._count?.teams}`} // Subtitle with teams count
            fullPage
          >
            {/* Render teams if available */}
            {fetchedData?.organization.teams && (
              <TeamElements
                isWindowElement
                organizationId={organizationId}
                teams={organization?.teams}
                isAdministrate={hasPermission} // Pass if user can administrate
              />
            )}
          </WindowContainer>
          {/* Render organization users management only for users with permission */}
          {hasPermission && (
            <WindowContainer
              title={organization?.title as string} // Window title is org name
              subtitle={`Participants: ${organization?._count?.organizationUsers}`} // Subtitle with users count
              fullPage
            >
              {organizationUsers && (
                <OrganizationUsers
                  organizationId={organizationId}
                  organizationUsers={organizationUsers}
                  setOrganizationUsers={setOrganizationUsers}
                  administrateRole={role} // Pass user role for permissions inside
                />
              )}
            </WindowContainer>
          )}

          {/* Action buttons area */}
          <div className={pageStyles["workspace-actions"]}>
            {/* Show delete button only for owners */}
            {role === OrgRole.OWNER && (
              <Button type="button" onClick={() => setOpenModal(true)}>
                <Trash size={22} className="mr-4" />
                Delete organization
              </Button>
            )}

            {/* Show exit button for roles other than owner/admin */}
            {role !== OrgRole.OWNER && role !== OrgRole.ADMIN && (
              <Button type="button" onClick={() => handleExit()}>
                <Trash size={22} className="mr-4" />
                Exit organization
              </Button>
            )}
          </div>

          {/* Confirmation modal for deleting organization */}
          {openModal && (
            <ModalWindow
              title="Program to ask of sure action.exe" // Modal title
              subtitle="Hey do you really know what you are doing ?" // Modal subtitle
              onClose={() => setOpenModal(false)} // Close modal handler
            >
              <div className={pageStyles["workspace-modal-container"]}>
                <div className={pageStyles["workspace-modal-container__desc"]}>
                  <h1>Hey did you know?</h1>
                  <p>
                    If you proceed on this action you will delete teams and
                    projects which are related to this organization. Make sure
                    that you understand that.
                  </p>
                </div>
                <div
                  className={
                    pageStyles["workspace-modal-container__btn-container"]
                  }
                >
                  {/* Delete button triggers deleteOrganization with success callback */}
                  <Button
                    type="button"
                    onClick={() =>
                      deleteOrganization(organizationId, {
                        onSuccess: () => {
                          saveOrganization(null); // Clear organization from context
                          replace("/workspace/organizations"); // Redirect after delete
                        },
                      })
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

          {/* Modal window for updating organization details */}
          {openModalUpdate && (
            <ModalWindow
              title="Update Organization.exe" // Modal title
              subtitle="It's time to update :()" // Modal subtitle
              onClose={() => setOpenModalUpdate(false)} // Close modal handler
            >
              {/* Render update form if organization data available */}
              {organization && (
                <div className={pageStyles["workspace-modal-container"]}>
                  <OrganizationUpdate
                    id={organization.id} // Organization ID to update
                    data={organization} // Current organization data
                    pullUpdatedData={setOrganization} // Callback to update local state
                    pullCloseModal={setOpenModalUpdate} // Callback to close modal
                  />
                </div>
              )}
            </ModalWindow>
          )}
        </div>
      )}
    </PageLayout>
  );
}
