"use client";

import { Button, ModalWindow } from "@/components/index";
import { useUpdateOrgOwner } from "@/hooks/organization/useUpdateOrgOwner";
import { useUpdateOrgRole } from "@/hooks/organization/useUpdateOrgRole";
import { useUpdateOrgStatus } from "@/hooks/organization/useUpdateOrgStatus";
import { OrgRole, OrgUserResponse } from "@/types/org.types";
import { AccessStatus } from "@/types/root.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Person, UserSwitch } from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction, useState } from "react";

import pageStyles from "@/app/page.module.scss";

interface OrganizationUsersProps {
  organizationUsers: OrgUserResponse[]; // List of users in the organization
  organizationId: string; // Current organization ID
  setOrganizationUsers: Dispatch<SetStateAction<OrgUserResponse[] | undefined>>; // State setter to update users list
  administrateRole: OrgRole; // Role of current user (e.g., OWNER, ADMIN)
}

/**
 * OrganizationUsers component displays and manages users within an organization.
 * It allows role changes, banning/unbanning users, and transferring ownership.
 *
 * @param {OrganizationUsersProps} props - Component properties
 * @returns {JSX.Element}
 */
export default function OrganizationUsers({
  organizationUsers,
  organizationId,
  setOrganizationUsers,
  administrateRole,
}: OrganizationUsersProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newOwnerId, setNewOwnerId] = useState<string>();

  // Hooks for API updates
  const { updateOwner } = useUpdateOrgOwner();
  const { updateRole } = useUpdateOrgRole();
  const { updateStatus } = useUpdateOrgStatus();

  // Update the local users array with the updated user info
  const handleUpdateArray = (updatedUser: OrgUserResponse) => {
    const updatedUsers = organizationUsers.map((user) =>
      user.userId === updatedUser.userId
        ? {
            ...user,
            role: updatedUser.role,
            organizationStatus: updatedUser.organizationStatus,
          }
        : user
    );
    setOrganizationUsers(updatedUsers);
  };

  // Change user role and update state on success
  const handleChangeRole = (orgUserId: string, newRole: OrgRole) => {
    updateRole(
      { orgUserId, id: organizationId, role: newRole },
      { onSuccess: (updatedUser) => handleUpdateArray(updatedUser) }
    );
  };

  // Toggle ban/unban status of a user
  const handleChangeStatus = (
    orgUserId: string,
    organizationStatus: AccessStatus
  ) => {
    updateStatus(
      {
        id: organizationId,
        orgUserId,
        organizationStatus:
          organizationStatus !== AccessStatus.BANNED
            ? AccessStatus.BANNED
            : AccessStatus.ACTIVE,
      },
      { onSuccess: (updatedUser) => handleUpdateArray(updatedUser) }
    );
  };

  // Open modal to confirm ownership transfer
  const handleTransferOwner = (orgUserId: string) => {
    setOpenModal(true);
    setNewOwnerId(orgUserId);
  };

  // Confirm transfer ownership action
  const transferOwner = () => {
    if (!newOwnerId) return;

    updateOwner(
      { id: organizationId, orgUserId: newOwnerId },
      {
        onSuccess: (updatedUser) => {
          handleUpdateArray(updatedUser);
          setOpenModal(false);
          window.location.reload(); // Refresh page to reflect ownership changes
        },
      }
    );
  };

  return (
    <div className={pageStyles["workspace-user-list"]}>
      <div className={pageStyles["workspace-user-list__title"]}>
        <h5>Users in current organization:</h5>
      </div>
      <div className={pageStyles["workspace-user-list__users"]}>
        {organizationUsers.length > 0 ? (
          organizationUsers.map((userItem, i) => (
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
                  <p>Status: "{userItem.organizationStatus}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__role"]
                  }
                >
                  <p>Role: "{userItem.role}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__tasks"]
                  }
                >
                  <p>Tasks: "{userItem.user?._count?.tasks}"</p>
                </div>
              </div>
              <div
                className={
                  pageStyles["workspace-user-list__users__item__actions"]
                }
              >
                {/* Owner can ban/unban and change roles except for other admins */}
                {administrateRole === OrgRole.OWNER &&
                userItem.role !== OrgRole.ADMIN ? (
                  <>
                    <Button
                      type="button"
                      modal
                      fullWidth
                      onClick={() =>
                        handleChangeStatus(
                          userItem.userId,
                          userItem.organizationStatus
                        )
                      }
                    >
                      {userItem.organizationStatus !== AccessStatus.BANNED
                        ? "Ban"
                        : "Remove Ban"}
                    </Button>
                    <Button
                      type="button"
                      modal
                      fullWidth
                      selectable
                      selectableArray={[
                        { text: "Admin" },
                        { text: "Member" },
                        { text: "Viewer" },
                      ]}
                      selectableOnClick={(newRole: string) =>
                        handleChangeRole(userItem.userId, newRole as OrgRole)
                      }
                    >
                      Change Role
                    </Button>
                  </>
                ) : /* Admin can ban/unban and change roles for non-admin users */
                administrateRole === OrgRole.ADMIN &&
                  userItem.role !== OrgRole.ADMIN ? (
                  <>
                    <Button
                      type="button"
                      modal
                      fullWidth
                      onClick={() =>
                        handleChangeStatus(
                          userItem.userId,
                          userItem.organizationStatus
                        )
                      }
                    >
                      {userItem.organizationStatus !== AccessStatus.BANNED
                        ? "Ban"
                        : "Remove Ban"}
                    </Button>
                    <Button
                      type="button"
                      modal
                      fullWidth
                      selectable
                      selectableArray={[
                        { text: "Admin" },
                        { text: "Member" },
                        { text: "Viewer" },
                      ]}
                      selectableOnClick={(newRole: string) =>
                        handleChangeRole(userItem.userId, newRole as OrgRole)
                      }
                    >
                      Change Role
                    </Button>
                  </>
                ) : null}

                {/* Only Owner can transfer ownership */}
                {administrateRole === OrgRole.OWNER && (
                  <Button
                    type="button"
                    modal
                    fullWidth
                    onClick={() => handleTransferOwner(userItem.userId)}
                  >
                    Transfer ownership
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={pageStyles["workspace-user-list__not-found"]}>
            <h5>You don't have any participants in current organization</h5>
          </div>
        )}
      </div>

      {/* Confirmation modal for ownership transfer */}
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
                If you proceed on this action you will be no longer an owner to
                this organization. Which means you remove all your privileges.
                Make sure that you understand that.
              </p>
            </div>
            <div
              className={pageStyles["workspace-modal-container__btn-container"]}
            >
              <Button type="button" onClick={() => transferOwner()}>
                <UserSwitch
                  size={22}
                  className={pageStyles["workspace-modal-container__ico"]}
                />{" "}
                Transfer
              </Button>
            </div>
          </div>
        </ModalWindow>
      )}
    </div>
  );
}
