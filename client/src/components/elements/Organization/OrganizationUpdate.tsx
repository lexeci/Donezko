"use client"; // Enables React Server Components to use client-side interactivity

import pageStyles from "@/app/page.module.scss"; // Imports scoped SCSS module for styling
import { Button, Field } from "@/components/index"; // Imports shared UI components
import { useUpdateOrg } from "@/hooks/organization/useUpdateOrg"; // Custom hook to handle organization update logic
import { OrgFormData, OrgResponse } from "@/types/org.types"; // Type definitions for organization form and response
import { Dispatch, SetStateAction, useEffect, useState } from "react"; // React hooks for side effects and state management
import { SubmitHandler, useForm } from "react-hook-form"; // React Hook Form utilities for form handling

interface OrganizationUpdate {
  id: string; // Organization ID
  data: OrgFormData; // Initial form data
  pullUpdatedData: Dispatch<SetStateAction<OrgResponse | undefined>>; // Callback to update parent state with new organization data
  pullCloseModal: Dispatch<SetStateAction<boolean>>; // Callback to close the modal
}

/**
 * OrganizationUpdate component renders a form for updating organization details,
 * including title, description, and join code, with form validation and submission.
 *
 * @param {Object} props - Component props
 * @param {string} props.id - The ID of the organization to update
 * @param {OrgFormData} props.data - Initial form data for the organization
 * @param {Dispatch<SetStateAction<OrgResponse | undefined>>} props.pullUpdatedData - Callback to pass updated organization data back to parent
 * @param {Dispatch<SetStateAction<boolean>>} props.pullCloseModal - Callback to control modal visibility
 * @returns {JSX.Element}
 */
export default function OrganizationUpdate({
  id,
  data: localData,
  pullUpdatedData,
  pullCloseModal,
}: OrganizationUpdate) {
  // Destructure mutation function and updated data from custom hook
  const { updateOrganization, updatedOrganization } = useUpdateOrg();

  // Initialize react-hook-form with real-time validation mode
  const { register, handleSubmit, setValue, reset } = useForm<OrgFormData>({
    mode: "onChange",
  });

  // On component mount, pre-fill form fields with existing organization data
  useEffect(() => {
    setValue("title", localData.title); // Pre-fill title field
    setValue("description", localData.description); // Pre-fill description field
  }, []); // Empty dependency array ensures this runs only once on mount

  // Local state to track joinCode string, initialized from provided data
  const [joinCode, setJoinCode] = useState<string>(
    localData.joinCode as string
  );

  /**
   * Generates a new random alphanumeric join code,
   * updates local state and form value accordingly.
   */
  const generateJoinCode = () => {
    const code = Math.random().toString(36).substr(2, 99).toUpperCase(); // Generate random uppercase code
    setJoinCode(code); // Update local joinCode state
    setValue("joinCode", code); // Update form field joinCode value
  };

  /**
   * Handles form submission by invoking the updateOrganization mutation
   * with the current organization ID and form data.
   *
   * @param {OrgFormData} data - Form data submitted by the user
   */
  const onSubmit: SubmitHandler<OrgFormData> = (data) => {
    updateOrganization({ id, data }); // Submit updated organization data
  };

  /**
   * Effect to handle side effects after receiving updated organization data:
   * - Resets form with updated data
   * - Passes updated data to parent component
   * - Closes the modal dialog
   * Runs whenever updatedOrganization changes.
   */
  useEffect(() => {
    if (updatedOrganization?.organization.id) {
      reset(updatedOrganization.organization); // Reset form fields with new data
      pullUpdatedData(updatedOrganization); // Send updated data back to parent
      pullCloseModal(false); // Close the modal
    }
  }, [updatedOrganization]); // Dependency on updatedOrganization

  return (
    <div className={pageStyles["workspace-basic-content-window"]}>
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Update your organization</h5> {/* Title header */}
      </div>
      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>Please write the title and description for your organization.</p>{" "}
        {/* User instructions */}
      </div>
      <div
        className={pageStyles["workspace-basic-content-window__operate-window"]}
      >
        <form
          className={pageStyles["workspace-basic-content-window__form"]}
          onSubmit={handleSubmit(onSubmit)} // Binds form submit to react-hook-form handler
        >
          {/* Title input field with validation */}
          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="title"
            label="Title:"
            placeholder="Enter title:"
            type="text"
            {...register("title", {
              required: "Title is required!", // Validation: required field
            })}
          />
          {/* Description input field with max length validation */}
          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="description"
            label="Description:"
            placeholder="Enter description"
            type="text"
            {...register("description", {
              maxLength: { value: 500, message: "Description is too long" }, // Validation: max length 500 characters
            })}
          />
          <div
            className={
              pageStyles["workspace-basic-content-window__form__container"]
            }
          >
            {/* Join code input field (read-only) */}
            <Field
              extra={pageStyles["workspace-basic-content-window__form__join"]}
              id="joinCode"
              label="JoinCode:"
              placeholder="Enter joinCode:"
              type="text"
              {...register("joinCode", {
                required: "JoinCode is required!", // Validation: required field
              })}
              readOnly // Make join code non-editable by user
              value={joinCode} // Bind joinCode state value to field
            />
            <div
              className={
                pageStyles["workspace-basic-content-window__form__join"]
              }
            >
              {/* Button to generate new join code */}
              <Button
                type="button"
                fullWidth
                block
                onClick={(e) => {
                  e.preventDefault(); // Prevent default button behavior
                  generateJoinCode(); // Generate and update join code
                }}
              >
                Generate
              </Button>
            </div>
          </div>
          <div
            className={
              pageStyles["workspace-basic-content-window__form__actions"]
            }
          >
            {/* Submit button to update organization - triggers form submit */}
            <Button type="button" block>
              Update Organization
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
