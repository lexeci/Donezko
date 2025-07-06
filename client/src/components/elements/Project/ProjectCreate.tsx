"use client";

import pageStyles from "@/app/page.module.scss"; // Import CSS module styles
import { Button, Field, Select } from "@/components/index"; // Import UI components: Button, Field, Select
import { useFetchOrgUsers } from "@/hooks/organization/useFetchOrgUsers"; // Custom hook to fetch organization users
import { useCreateProject } from "@/hooks/project/useCreateProject"; // Custom hook to create a project
import { OrgUserResponse } from "@/types/org.types"; // Type for organization user response
import { ProjectFormData } from "@/types/project.types"; // Type for project form data
import { Dispatch, SetStateAction, useEffect, useState } from "react"; // React hooks and types
import { SubmitHandler, useForm } from "react-hook-form"; // React Hook Form utilities

/**
 * ProjectCreate component — form for creating a new project
 *
 * @param {object} props - Component properties
 * @param {string | null | undefined} [props.organizationId] - Organization ID (optional)
 * @param {string | undefined} [props.organizationTitle] - Organization title (optional, for display)
 * @param {() => void} props.handleRefetch - Function to refresh the project list after creation
 * @param {Dispatch<SetStateAction<boolean>>} props.setOpen - Function to control modal open/close state
 *
 * @returns {JSX.Element} — React element rendering the project creation form
 */
export default function ProjectCreate({
  organizationId,
  organizationTitle,
  handleRefetch,
  setOpen,
}: {
  organizationId?: string | null;
  organizationTitle?: string;
  handleRefetch: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // Fetch organization users using custom hook
  const { organizationUserList } = useFetchOrgUsers({ organizationId });

  // Local state to hold organization users for the Select options
  const [organizationUsers, setOrganizationUsersList] =
    useState<OrgUserResponse[]>();

  // Hook for creating a project and getting the created project data
  const { createProject, createdProject } = useCreateProject();

  // Initialize react-hook-form with type safety for ProjectFormData
  const { register, handleSubmit, setValue, reset } = useForm<ProjectFormData>({
    mode: "onChange", // Validate fields on change
  });

  // Form submit handler — triggers project creation with form data
  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
    createProject(data);
  };

  // On component mount or when organizationId changes, set it in the form
  useEffect(() => {
    if (organizationId) {
      setValue("organizationId", organizationId);
    }
  }, []);

  // When organizationUserList updates, update local organizationUsers state
  useEffect(() => {
    if (organizationUserList) {
      setOrganizationUsersList(organizationUserList);
    }
  }, [organizationUserList]);

  // After a project is successfully created, reset the form, close modal, and refresh project list
  useEffect(() => {
    if (createdProject?.id) {
      reset(); // Clear the form fields
      setOpen(false); // Close the modal window
      handleRefetch(); // Refresh the project list
    }
  }, [createdProject]);

  return (
    // Main container with styles
    <div className={pageStyles["workspace-basic-content-window"]}>
      {/* Title showing the organization name */}
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Create your own project in {organizationTitle}</h5>
      </div>

      {/* Instructional text */}
      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>Please write the title and description for your project.</p>
      </div>

      {/* Operation window: either form or message */}
      <div
        className={pageStyles["workspace-basic-content-window__operate-window"]}
      >
        {/* If there are organization users, show the form */}
        {organizationUsers && organizationUsers.length > 0 ? (
          <form
            className={pageStyles["workspace-basic-content-window__form"]}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Title input field */}
            <Field
              extra={pageStyles["workspace-basic-content-window__form__fields"]}
              id="title"
              label="Title:"
              placeholder="Enter title:"
              type="text"
              {...register("title", {
                required: "Title is required!",
              })}
            />

            {/* Description input field */}
            <Field
              extra={pageStyles["workspace-basic-content-window__form__fields"]}
              id="description"
              label="Description:"
              placeholder="Enter description"
              type="text"
              {...register("description", {
                maxLength: { value: 500, message: "Description is too long" }, // Limit max length
              })}
            />

            {/* Select dropdown to choose project manager */}
            <Select
              extra={pageStyles["workspace-basic-content-window__form__fields"]}
              id="manager-select"
              label="Select Manager:"
              placeholder="Choose a manager"
              options={organizationUsers.map((item) => ({
                value: item.userId, // Value submitted in form
                label: item.user.name, // Text displayed in dropdown
              }))}
              {...register("projectManagerId", {
                required: "Manager is required!",
              })}
            />

            {/* Form action buttons container */}
            <div
              className={
                pageStyles["workspace-basic-content-window__form__actions"]
              }
            >
              {/* Submit button */}
              <Button type="button" block>
                Create Project
              </Button>
            </div>
          </form>
        ) : (
          // If no users, show info message instead of form
          <div
            className={pageStyles["workspace-basic-content-window__text-block"]}
          >
            <p>You cannot create a project due to lack of members</p>
          </div>
        )}
      </div>
    </div>
  );
}
