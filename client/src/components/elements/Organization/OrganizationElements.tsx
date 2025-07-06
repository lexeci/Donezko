"use client"; // Enables client-side rendering

import pageStyles from "@/app/page.module.scss"; // Global layout styles for the page

import { Button, EntityItem } from "@/components/index"; // Reusable UI components
import { useOrganization } from "@/context/OrganizationContext"; // Access to organization context
import { useFetchOrgs } from "@/hooks/organization/useFetchOrgs"; // Custom hook to fetch list of organizations
import generateKeyComp from "@/utils/generateKeyComp"; // Utility to generate unique keys for React lists
import { Buildings } from "@phosphor-icons/react"; // Icon for organization item
import { Plus } from "@phosphor-icons/react/dist/ssr"; // Plus icon for "Add organization" button
import { useState } from "react"; // React hook for state management
import OrganizationModal from "./OrganizationModal"; // Modal component for join/create actions

import { DASHBOARD_PAGES } from "@/src/pages-url.config"; // Route constants for navigation
import styles from "./OrganizationElements.module.scss"; // Scoped styles for this component

/**
 * OrganizationElements component displays a list of organizations,
 * shows the total count, and provides a button to add (join/create) organizations.
 *
 * @returns {JSX.Element}
 */
export default function OrganizationElements() {
  const { saveOrganization } = useOrganization(); // Function to store selected organization ID
  const { organizationList, handleRefetch } = useFetchOrgs(); // List of organizations and refetch function
  const [open, setOpen] = useState<boolean>(false); // Modal open state

  return (
    <div className={pageStyles["workspace-content-col"]}>
      {/* Renders modal if open is true */}
      {open && <OrganizationModal setOpen={setOpen} refetch={handleRefetch} />}

      {/* Header section with total count and "Add Organization" button */}
      <div className={pageStyles["workspace-basic-counter"]}>
        <div className={styles.title}>
          <h4>Total Organizations: {organizationList?.length}</h4>{" "}
          {/* Displays total count */}
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus size={22} className="mr-4" /> Organization{" "}
          {/* Opens the modal */}
        </Button>
      </div>

      {/* Grid displaying organization cards */}
      <div className={pageStyles["workspace-content-grid-3"]}>
        {organizationList?.map((item, i) => {
          const { organization } = item;
          const { _count } = organization; // Access count data: users and teams
          return (
            <EntityItem
              key={generateKeyComp(`${organization.title}__${i}`)} // Unique key for list rendering
              icon={<Buildings size={84} />} // Icon representing the organization
              linkBase={`${DASHBOARD_PAGES.ORGANIZATIONS}/${organization.id}`} // Link to organization details
              title={organization.title} // Organization name
              firstStat={`Participants: ${_count?.organizationUsers}`} // Number of users
              secondaryStat={`Teams: ${_count?.teams}`} // Number of teams
              onClick={() => saveOrganization(organization.id)} // Stores org ID on card click
            />
          );
        })}
      </div>
    </div>
  );
}
