"use client";

import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgs } from "@/hooks/organization/useFetchOrgs";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx"; // Import clsx for conditional class names
import { useEffect, useState } from "react";
import { OrganizationModal } from "../../elements";

import styles from "./SelectOrganization.module.scss";

/**
 * SelectOrganization component allows the user to select an organization from a dropdown list,
 * view the selected organization details, and open a modal to create a new organization.
 *
 * It uses context to get and save the selected organization ID and fetches the list of organizations.
 *
 * @component
 *
 * @returns {JSX.Element} The organization selector UI with dropdown and modal controls.
 */
export default function SelectOrganization() {
  const { organizationId, saveOrganization } = useOrganization(); // Get current organizationId and setter from context
  const { organizationList, handleRefetch } = useFetchOrgs(); // Fetch organizations list and refetch handler

  const [isOpen, setIsOpen] = useState(false); // Controls visibility of the dropdown list
  const [openModal, setOpenModal] = useState<boolean>(false); // Controls visibility of the "create organization" modal

  const [selectedOrg, setSelectedOrg] = useState<string | null>(organizationId); // Currently selected organization ID

  /**
   * Handles organization selection from the list.
   * Saves the selection to context and closes the dropdown.
   *
   * @param {string} orgId - The ID of the organization to select.
   */
  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrg(orgId);
    saveOrganization(orgId);
    setIsOpen(false);
  };

  // Sync local selectedOrg state with context organizationId on changes
  useEffect(() => {
    if (organizationId) {
      const currentOrganization = organizationList?.find(
        (org) => org.organization.id === organizationId
      );
      if (currentOrganization) {
        setSelectedOrg(currentOrganization.organization.id);
      }
    } else {
      setSelectedOrg(null);
    }
  }, [organizationId, organizationList]);

  return (
    <div className={styles["selected-org"]}>
      {/* Organization creation modal */}
      {openModal && (
        <OrganizationModal setOpen={setOpenModal} refetch={handleRefetch} />
      )}

      {/* Selected organization display or prompt to select */}
      {selectedOrg ? (
        <div
          className={styles["selected-org__btn"]}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Selected: </span>
          <span className={styles["selected-org__name"]}>
            {
              organizationList?.find(
                (org) => org.organization.id === selectedOrg
              )?.organization.title
            }
          </span>
        </div>
      ) : (
        <div
          className={styles["not-selected-org"]}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles["not-selected-org__title"]}>
            Select Organization
          </span>
        </div>
      )}

      {/* Dropdown list of organizations */}
      {isOpen && (
        <div className={styles["org-list"]}>
          <div className={styles["org-list__manage-org"]}>
            <div className={styles["org-list__manage-org__title"]}>
              <h5>Actions:</h5>
            </div>
            <div
              className={styles["org-list__manage-org__item"]}
              onClick={() => setOpenModal(true)}
            >
              <Plus size={12} className="mr-2" /> Organization
            </div>
          </div>

          <div className={styles["org-list__container"]}>
            {organizationList?.map((org) => {
              const isSelected = selectedOrg === org.organization.id;
              return (
                <div
                  key={org.organization.id}
                  className={clsx(
                    styles["org-list__container__item"],
                    isSelected && styles["org-list__container__item__selected"],
                    !isSelected &&
                      styles["org-list__container__item__not-selected"]
                  )}
                  onClick={() =>
                    !isSelected && handleSelectOrganization(org.organization.id)
                  }
                >
                  <div
                    className={styles["org-list__container__item__container"]}
                  >
                    <div
                      className={styles["org-list__container__item__details"]}
                    >
                      {`Organization: ${org.organization.title}`}
                    </div>
                    <div
                      className={styles["org-list__container__item__details"]}
                    >
                      {`Members: ${
                        org.organization._count?.organizationUsers || 0
                      } / Projects: ${org.organization._count?.projects}`}
                    </div>
                    <div
                      className={styles["org-list__container__item__details"]}
                    >
                      {`Role: ${org.role || "N/A"}`}
                    </div>
                    <div
                      className={styles["org-list__container__item__status"]}
                    >
                      {`Status: ${org.organizationStatus || "Inactive"}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
