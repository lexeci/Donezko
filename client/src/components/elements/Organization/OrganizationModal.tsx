"use client"; // Enables client-side rendering for this component

import { AnimatedLink } from "@/components/index"; // Imports reusable animated link component
import { SetStateAction, useState } from "react"; // Imports React state and type utilities
import ModalWindow from "../ModalWindow/ModalWindow"; // Imports modal wrapper component
import OrganizationCreate from "./OrganizationCreate"; // Imports form component for creating an organization
import OrganizationJoin from "./OrganizationJoin"; // Imports form component for joining an organization

import styles from "./OrganizationElements.module.scss"; // Imports SCSS module for styling

/**
 * OrganizationModal component renders a modal window to manage organization actions.
 * It toggles between two forms: joining an existing organization or creating a new one.
 *
 * @param {Object} props - Component props
 * @param {(value: SetStateAction<boolean>) => void} props.setOpen - Function to set modal open/close state
 * @param {() => void} [props.refetch] - Optional function to refetch organization data after changes
 * @returns {JSX.Element}
 */
export default function OrganizationModal({
  setOpen,
  refetch,
}: {
  setOpen: (value: SetStateAction<boolean>) => void; // Function to update modal visibility
  refetch?: () => void; // Optional callback to refetch data after action
}) {
  const [formType, setFormType] = useState<"join" | "create">("join"); // Local state to toggle between join and create modes

  return (
    <ModalWindow
      title="Organization manager.exe" // Title displayed in the modal
      subtitle="The manager to operate your organization" // Subtitle displayed in the modal
      onClose={() => setOpen(false)} // Closes the modal when triggered
    >
      <div className={styles["modal-switcher"]}>
        <div className={styles.title}>
          <h5>Please choose your action: </h5> {/* Prompt for user action */}
        </div>
        <AnimatedLink
          type="button"
          link="#"
          title={
            formType !== "join" ? "I want to join!" : "I want to create my own!" // Button text based on current formType
          }
          onClick={
            () =>
              formType !== "join" ? setFormType("join") : setFormType("create") // Toggles between join and create form
          }
        />
      </div>
      {formType !== "join" ? (
        <OrganizationCreate refetch={refetch} /> // Renders create organization form
      ) : (
        <OrganizationJoin refetch={refetch} setOpen={setOpen} /> // Renders join organization form
      )}
    </ModalWindow>
  );
}
