"use client";

import pageStyles from "@/app/page.module.scss";
import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchProjectUsers } from "@/hooks/project/useFetchProjectUser";
import { useRemoveProjectUser } from "@/hooks/project/useRemoveProjectUser";
import { useTransferProjectManager } from "@/hooks/project/useTransferProjectManager";
import { useUpdateProjectUser } from "@/hooks/project/useUpdateProjectUser";
import { OrgRole } from "@/types/org.types";
import { ProjectUsers as ProjectUsersType } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react";

/**
 * ProjectUsers component
 *
 * Displays the list of users assigned to a specific project, along with their
 * roles and statuses within the project. Provides buttons to ban/unban users,
 * remove users from the project, or transfer the manager role.
 *
 * Access to certain actions depends on the current user's role (Admin/Owner).
 *
 * @param {Object} props
 * @param {string} props.projectId - The ID of the project to fetch users for.
 * @param {OrgRole} [props.role] - The role of the current user in the organization.
 *
 * @returns {JSX.Element} A user list interface with management controls.
 */
export default function ProjectUsers({
  projectId,
  role,
}: {
  projectId: string;
  role?: OrgRole;
}) {
  // Get current organization ID from context
  const { organizationId } = useOrganization();

  // Fetch users of the project along with setter and refetch handler
  const { projectUsers, setProjectUsers, handleRefetch } = useFetchProjectUsers(
    projectId,
    organizationId
  );

  // Hooks for updating user status, removing users, and transferring manager role
  const { updateStatus } = useUpdateProjectUser();
  const { removeUser } = useRemoveProjectUser();
  const { transferManager } = useTransferProjectManager();

  /**
   * Update the local project users list when a user's status changes.
   *
   * @param {ProjectUsersType} updatedUser - The user object with updated data.
   */
  const handleUpdateArray = (updatedUser: ProjectUsersType) => {
    const updatedUsers = projectUsers?.map((user) =>
      user.userId === updatedUser.userId
        ? { ...user, projectStatus: updatedUser.projectStatus }
        : user
    );

    setProjectUsers(updatedUsers);
  };

  /**
   * Toggle the project status of a user between BANNED and ACTIVE.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {AccessStatus} projectStatus - The current status of the user.
   */
  const handleChangeStatus = (userId: string, projectStatus: AccessStatus) => {
    if (!organizationId) return;

    updateStatus(
      {
        projectId,
        userId,
        status:
          projectStatus !== AccessStatus.BANNED
            ? AccessStatus.BANNED
            : AccessStatus.ACTIVE,
        organizationId,
      },
      {
        onSuccess: (updatedUser) => {
          handleUpdateArray(updatedUser);
          handleRefetch(); // Refetch data after successful status update
        },
      }
    );
  };

  /**
   * Remove a user from the current project.
   *
   * @param {string} projectId - The current project ID.
   * @param {string} userId - The ID of the user to remove.
   */
  const handleExitProject = (projectId: string, userId: string) => {
    if (!organizationId) return;

    removeUser(
      {
        projectId,
        userId,
        organizationId,
      },
      {
        onSuccess: (removedUser) => {
          const updatedUsers = projectUsers?.filter(
            (user) => user.userId !== removedUser.userId
          );
          setProjectUsers(updatedUsers);
          handleRefetch(); // Refetch after removal
        },
      }
    );
  };

  /**
   * Transfer the project manager role to another user.
   *
   * @param {string} projectId - The current project ID.
   * @param {string} userId - The ID of the user to transfer the manager role to.
   */
  const handleTransferProject = (projectId: string, userId: string) => {
    if (!organizationId) return;

    transferManager(
      {
        projectId,
        userId,
        organizationId,
      },
      {
        onSuccess: (updatedUser) => {
          handleUpdateArray(updatedUser);
          handleRefetch(); // Refetch after role transfer
        },
      }
    );
  };

  return (
    <div className={pageStyles["workspace-user-list"]}>
      <div className={pageStyles["workspace-user-list__title"]}>
        <h5>Users in current project:</h5>
      </div>
      <div className={pageStyles["workspace-user-list__users"]}>
        {projectUsers && projectUsers.length > 0 ? (
          projectUsers.map((userItem, i) => (
            <div
              className={pageStyles["workspace-user-list__users__item"]}
              key={generateKeyComp(`${userItem.user.name}__${i}`)}
            >
              <Person
                size={48}
                className={pageStyles["workspace-user-list__users__item__ico"]}
              />
              <div
                className={
                  pageStyles["workspace-user-list__users__item__about"]
                }
              >
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__name"]
                  }
                >
                  <p>Username: {userItem.user.name}</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__email"]
                  }
                >
                  <p>Email: "{userItem.user.email}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__status"]
                  }
                >
                  <p>Status: "{userItem.projectStatus}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__role"]
                  }
                >
                  <p>Role: "{userItem.role}"</p>
                </div>
              </div>
              <div
                className={
                  pageStyles["workspace-user-list__users__item__actions"]
                }
              >
                <Button
                  type="button"
                  modal
                  fullWidth
                  onClick={() =>
                    handleChangeStatus(userItem.userId, userItem.projectStatus)
                  }
                >
                  {userItem.projectStatus === AccessStatus.BANNED
                    ? "Remove Ban"
                    : "Ban from Project"}
                </Button>
                {role && (role === OrgRole.ADMIN || role === OrgRole.OWNER) && (
                  <Button
                    type="button"
                    modal
                    fullWidth
                    onClick={() =>
                      handleExitProject(projectId, userItem.userId)
                    }
                  >
                    Remove from Project
                  </Button>
                )}
                {role && (role === OrgRole.ADMIN || role === OrgRole.OWNER) && (
                  <Button
                    type="button"
                    modal
                    fullWidth
                    onClick={() =>
                      handleTransferProject(projectId, userItem.userId)
                    }
                  >
                    Transfer Manager Role
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={pageStyles["workspace-user-list__not-found"]}>
            <h5>
              You don't have any participants from organization in current
              project
            </h5>
          </div>
        )}
      </div>
    </div>
  );
}
