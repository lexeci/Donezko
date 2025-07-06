"use client"; // Enables client-side rendering for this component

import { Button, Field } from "@/components/index"; // Imports reusable Button and Field components
import { useJoinOrg } from "@/hooks/organization/useJoinOrg"; // Custom hook for joining an organization
import { JoinOrgType } from "@/types/org.types"; // Type definition for the join organization form
import { SetStateAction, useEffect } from "react"; // React utilities for side effects and type usage
import { SubmitHandler, useForm } from "react-hook-form"; // Form management and validation from react-hook-form

import pageStyles from "@/app/page.module.scss"; // Imports scoped SCSS styles for the page layout
import { useOrganization } from "@/context/OrganizationContext"; // Custom hook for accessing organization context

/**
 * OrganizationJoin component renders a form to join an existing organization.
 * It manages form state, validation, and submission using react-hook-form and custom hooks.
 *
 * @param {Object} props - Component props
 * @param {() => void} [props.refetch] - Optional callback to refetch data after joining
 * @param {(value: SetStateAction<boolean>) => void} [props.setOpen] - Optional function to close the modal
 * @returns {JSX.Element}
 */
export default function OrganizationJoin({
  refetch,
  setOpen,
}: {
  refetch?: () => void; // Optional callback to refresh data after join
  setOpen?: (value: SetStateAction<boolean>) => void; // Optional function to close the modal
}) {
  const { saveOrganization } = useOrganization(); // Accesses organization context to store organization ID
  const { joinOrganization, joinedOrganization } = useJoinOrg(); // Hook functions to join organization and access join result

  const { register, handleSubmit, setValue, reset } = useForm<JoinOrgType>({
    mode: "onChange", // Enables validation on every change
  });

  const onSubmit: SubmitHandler<JoinOrgType> = (data) => {
    joinOrganization(data); // Triggers join organization action with form data
  };

  useEffect(() => {
    if (joinedOrganization?.id) {
      reset(joinedOrganization); // Resets form with joined organization data
      joinedOrganization?.organizationId &&
        saveOrganization(joinedOrganization.organizationId); // Saves organization ID in context
      refetch && refetch(); // Calls refetch if defined
      setOpen && setOpen(false); // Closes the modal if setOpen is provided
    }
  }, [joinedOrganization]); // Dependency array watches for changes in join result

  return (
    <div className={pageStyles["workspace-basic-content-window"]}>
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Join to your organization</h5> {/* Modal title */}
      </div>
      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>
          Please write the title and join code to connect with organization.
        </p>{" "}
        {/* Instructional text for the user */}
      </div>
      <div
        className={pageStyles["workspace-basic-content-window__operate-window"]}
      >
        <form
          className={pageStyles["workspace-basic-content-window__form"]}
          onSubmit={handleSubmit(onSubmit)} // Handles form submission with validation
        >
          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="title"
            label="Title:"
            placeholder="Enter title:"
            type="text"
            {...register("title", {
              required: "Title is required!", // Validation rule for required field
            })}
          />

          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="joinCode"
            label="JoinCode:"
            placeholder="Enter joinCode:"
            type="text"
            {...register("joinCode", {
              required: "JoinCode is required!", // Validation rule for required field
            })}
          />
          <div
            className={
              pageStyles["workspace-basic-content-window__form__actions"]
            }
          >
            <Button type="button" block>
              Accept Join
            </Button>{" "}
            {/* Button to trigger join (currently type="button", not submit) */}
          </div>
        </form>
      </div>
    </div>
  );
}
