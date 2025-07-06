"use client";

import pageStyles from "@/app/page.module.scss"; // Import styles
import { useFetchOrgUsers } from "@/hooks/organization/useFetchOrgUsers"; // Hook to fetch org users
import { useAddProjectUser } from "@/hooks/project/useAddProjectUser"; // Hook to add user to project
import { OrgUserResponse } from "@/types/org.types"; // Org user type
import generateKeyComp from "@/utils/generateKeyComp"; // Utility to generate unique keys for React list items
import { Person } from "@phosphor-icons/react"; // Person icon component
import { Button } from "../../ui"; // Custom Button component

/**
 * AddProjectUsers component
 *
 * Displays a list of organization users who are not yet members of the current project,
 * and allows adding them to the project.
 *
 * @param {object} props - Component props
 * @param {string} props.organizationId - ID of the organization
 * @param {string} props.projectId - ID of the project
 */
export default function AddProjectUsers({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  // Fetch organization users who are NOT yet added to the current project (hideFromProject: true)
  const { organizationUserList, setOrganizationUserList } = useFetchOrgUsers({
    organizationId,
    projectId,
    hideFromProject: true,
  });

  // Hook providing a method to add a user to a project
  const { addUser } = useAddProjectUser();

  /**
   * Updates the local organizationUserList by removing the user that was just added
   * to the project (to reflect the user is no longer available to add).
   *
   * @param {OrgUserResponse} updatedUser - User who was added to the project
   */
  const handleUpdateArray = (updatedUser: OrgUserResponse) => {
    if (organizationUserList) {
      // Filter out the user who was added, removing them from the list
      const updatedUsers = organizationUserList.filter(
        (user) => user.userId !== updatedUser.userId
      );
      setOrganizationUserList(updatedUsers);
    }
  };

  /**
   * Handles the click event for adding a user to the project.
   * Calls the addUser mutation and updates the user list on success.
   *
   * @param {string} projectId - ID of the current project
   * @param {string} userId - ID of the user to add
   */
  const handleAddUser = (projectId: string, userId: string) => {
    if (organizationId) {
      addUser(
        {
          projectId,
          userId,
          organizationId,
        },
        {
          onSuccess: (addedUser) => handleUpdateArray(addedUser),
        }
      );
    }
  };

  return (
    <div className={pageStyles["workspace-user-list"]}>
      {/* Title */}
      <div className={pageStyles["workspace-user-list__title"]}>
        <h5>Users in current organization:</h5>
      </div>

      {/* User list container */}
      <div className={pageStyles["workspace-user-list__users"]}>
        {/* If there are users who can be added */}
        {organizationUserList && organizationUserList.length > 0 ? (
          organizationUserList.map((userItem, i) => (
            <div
              key={generateKeyComp(`${userItem.user.name}__${i}`)} // Unique key for React list
              className={pageStyles["workspace-user-list__users__item"]}
            >
              {/* User icon */}
              <Person
                size={48}
                className={pageStyles["workspace-user-list__users__item__ico"]}
              />

              {/* User info: name, email, status, role */}
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
                  <p>Status: "{userItem.organizationStatus}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__role"]
                  }
                >
                  <p>Role: "{userItem.role}"</p>
                </div>
              </div>

              {/* Action button to add user to project */}
              <div
                className={
                  pageStyles["workspace-user-list__users__item__actions"]
                }
              >
                <Button
                  type="button"
                  modal
                  fullWidth
                  onClick={() => handleAddUser(projectId, userItem.userId)}
                >
                  Add user
                </Button>
              </div>
            </div>
          ))
        ) : (
          // If no users available to add, show message
          <div className={pageStyles["workspace-user-list__not-found"]}>
            <h5>
              You don't have any participants from organization who haven't been
              in current project yet
            </h5>
          </div>
        )}
      </div>
    </div>
  );
}
