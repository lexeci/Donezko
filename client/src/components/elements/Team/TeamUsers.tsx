"use client";

import pageStyles from "@/app/page.module.scss";
import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchUsersTeam } from "@/hooks/team/useFetchUsersTeam";
import { useRemoveUserFromTeam } from "@/hooks/team/useRemoveUserFromTeam";
import { useTransferLeadership } from "@/hooks/team/useTransferLeadership";
import { useUpdateTeamStatus } from "@/hooks/team/useUpdateTeamStatus";
import { OrgRole } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import { TeamRole, TeamUsersResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import AddUserToTeams from "./OperateElements/AddUserToTeams";

interface TeamUsersProps {
  teamId: string;
  orgRole?: OrgRole;
  role?: TeamRole;
}

/**
 * TeamUsers component renders a list of users associated with a team,
 * allowing actions like banning, removing, and transferring leadership,
 * depending on the current user's organization and team roles.
 *
 * @param {TeamUsersProps} props - Component properties
 * @param {string} props.teamId - The ID of the team whose users are displayed
 * @param {OrgRole} [props.orgRole] - The current user's organization role (for permission checks)
 * @param {TeamRole} [props.role] - The current user's team role (for permission checks)
 *
 * @returns JSX.Element - A styled user list with management buttons and modal for adding users
 */
export default function TeamUsers({ teamId, orgRole, role }: TeamUsersProps) {
  // Modal state for "Add user to team" dialog
  const [showModal, setShowModal] = useState<boolean>(false);

  // Extract current organization ID from context
  const { organizationId } = useOrganization();

  // Custom hook to fetch and refetch team users data
  const { teamUsers, setTeamUsers, handleRefetch } = useFetchUsersTeam({
    organizationId,
    id: teamId,
  });

  // Hooks to perform updates: team status, remove user, transfer leader
  const { updateStatus } = useUpdateTeamStatus();
  const { removeUser } = useRemoveUserFromTeam();
  const { transferLeadership } = useTransferLeadership();

  // Determine permission based on org and team roles
  const hasPermission = orgRole === OrgRole.ADMIN || orgRole === OrgRole.OWNER;
  const isLeader = role === TeamRole.LEADER;

  /**
   * Updates the teamUsers state array after modifying a user
   * @param {TeamUsersResponse} updatedUser - User object with updated info
   */
  const handleUpdateArray = (updatedUser: TeamUsersResponse) => {
    if (teamUsers) {
      const updatedUsers = teamUsers.map((user) =>
        user.userId === updatedUser.userId
          ? {
              ...user,
              teamStatus: updatedUser.teamStatus,
              role: updatedUser.role,
            }
          : user
      );
      setTeamUsers(updatedUsers);
    }
  };

  /**
   * Toggles ban status of a user in the team
   * @param {string} userId - User ID to update status
   * @param {AccessStatus} projectStatus - Current status of the user
   */
  const handleChangeStatus = (userId: string, projectStatus: AccessStatus) => {
    if (organizationId)
      updateStatus(
        {
          id: teamId,
          teamUserId: userId,
          teamStatus:
            projectStatus !== AccessStatus.BANNED
              ? AccessStatus.BANNED
              : AccessStatus.ACTIVE,
          organizationId,
        },
        {
          onSuccess: (updatedUser) => {
            handleUpdateArray(updatedUser);
            handleRefetch();
          },
        }
      );
  };

  /**
   * Removes a user from the team
   * @param {string} teamId - Team ID
   * @param {string} userId - User ID to remove
   */
  const handleRemoveUser = (teamId: string, userId: string) => {
    if (organizationId)
      removeUser(
        {
          id: teamId,
          teamUserId: userId,
          organizationId,
        },
        {
          onSuccess: (removedUser) => {
            if (teamUsers) {
              const updatedUsers = teamUsers.filter(
                (user) => user.userId !== removedUser.userId
              );
              setTeamUsers(updatedUsers);
              handleRefetch();
            }
          },
        }
      );
  };

  /**
   * Transfers leadership role to another team member
   * @param {string} teamId - Team ID
   * @param {string} userId - User ID to become leader
   */
  const handleTransferLeader = (teamId: string, userId: string) => {
    if (organizationId)
      transferLeadership(
        {
          id: teamId,
          teamUserId: userId,
          organizationId,
        },
        {
          onSuccess: (updatedUser) => {
            handleUpdateArray(updatedUser);
            handleRefetch();
          },
        }
      );
  };

  return (
    <div className={pageStyles["workspace-user-list"]}>
      <div className={pageStyles["workspace-user-list__header"]}>
        <div className={pageStyles["workspace-user-list__title"]}>
          <h5>Users in current project:</h5>
        </div>
        <div className={pageStyles["workspace-user-list__header__button"]}>
          {hasPermission && (
            <Button
              type="button"
              modal
              fullWidth
              onClick={() => setShowModal(true)}
            >
              Connect more Users
            </Button>
          )}
        </div>
      </div>
      <div className={pageStyles["workspace-user-list__users"]}>
        {teamUsers && teamUsers.length > 0 ? (
          teamUsers.map((userItem, i) => (
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
                {userItem.user.email && (
                  <div
                    className={
                      pageStyles["workspace-user-list__users__item__email"]
                    }
                  >
                    <p>Email: "{userItem.user.email}"</p>
                  </div>
                )}
                {userItem.teamStatus && (
                  <div
                    className={
                      pageStyles["workspace-user-list__users__item__status"]
                    }
                  >
                    <p>Status: "{userItem.teamStatus}"</p>
                  </div>
                )}
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
                {(isLeader || hasPermission) && userItem?.teamStatus && (
                  <Button
                    type="button"
                    modal
                    fullWidth
                    onClick={() =>
                      handleChangeStatus(
                        userItem.userId,
                        userItem.teamStatus as AccessStatus
                      )
                    }
                  >
                    {userItem.teamStatus === AccessStatus.BANNED
                      ? "Remove Ban"
                      : "Ban from Team"}
                  </Button>
                )}
                {hasPermission && (
                  <Button
                    type="button"
                    modal
                    fullWidth
                    onClick={() => handleRemoveUser(teamId, userItem.userId)}
                  >
                    Remove from Team
                  </Button>
                )}
                {(isLeader || hasPermission) && (
                  <Button
                    type="button"
                    modal
                    fullWidth
                    onClick={() =>
                      handleTransferLeader(teamId, userItem.userId)
                    }
                  >
                    Transfer Leader Role
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
      {showModal && (
        <AddUserToTeams
          teamId={teamId}
          setOpenModalUpdate={setShowModal}
          refetch={handleRefetch}
        />
      )}
    </div>
  );
}
