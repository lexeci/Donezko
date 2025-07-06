"use client";

import { Button, Field } from "@/components/index";
import { useCreateOrg } from "@/hooks/organization/useCreateOrg";
import { OrgFormData } from "@/types/org.types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import pageStyles from "@/app/page.module.scss";

/**
 * OrganizationCreate component allows users to create a new organization
 * by filling out a form with title, description, and a generated join code.
 *
 * @param {object} props
 * @param {() => void | undefined} props.refetch Optional callback to refresh data after creation
 */
export default function OrganizationCreate({
  refetch,
}: {
  refetch: (() => void) | undefined;
}) {
  const { createOrganization, newOrganization } = useCreateOrg(); // Hook for creating org and accessing newly created org

  const { register, handleSubmit, setValue, reset } = useForm<OrgFormData>({
    mode: "onChange", // Validate on each change
  });

  // Local state to hold the generated joinCode
  const [joinCode, setJoinCode] = useState<string>("");

  /**
   * Generates a unique join code, sets it in local state,
   * and updates the form field value accordingly.
   */
  const generateJoinCode = () => {
    const code = Math.random().toString(36).substr(2, 99).toUpperCase(); // Generate random uppercase string
    setJoinCode(code);
    setValue("joinCode", code); // Update form's joinCode field
  };

  // Generate joinCode on component mount
  useEffect(() => {
    generateJoinCode();
  }, []);

  // Handle form submission by calling createOrganization with form data
  const onSubmit: SubmitHandler<OrgFormData> = (data) => {
    createOrganization(data);
  };

  // When newOrganization changes (i.e., after creation), reset form and optionally refetch data
  useEffect(() => {
    if (newOrganization?.id) {
      reset(); // Clear the form
      refetch && refetch(); // Call refetch if provided
    }
  }, [newOrganization]);

  return (
    <div className={pageStyles["workspace-basic-content-window"]}>
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Create your own organization</h5> {/* Form title */}
      </div>
      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>Please write the title and description for your organization.</p>{" "}
        {/* Instruction */}
      </div>
      <div
        className={pageStyles["workspace-basic-content-window__operate-window"]}
      >
        <form
          className={pageStyles["workspace-basic-content-window__form"]}
          onSubmit={handleSubmit(onSubmit)} // React Hook Form submit handler
        >
          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="title"
            label="Title:"
            placeholder="Enter title:"
            type="text"
            {...register("title", {
              required: "Title is required!", // Validation rule: required
            })}
          />
          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="description"
            label="Description:"
            placeholder="Enter description"
            type="text"
            {...register("description", {
              maxLength: { value: 500, message: "Description is too long" }, // Max length validation
            })}
          />
          <div
            className={
              pageStyles["workspace-basic-content-window__form__container"]
            }
          >
            <Field
              extra={pageStyles["workspace-basic-content-window__form__join"]}
              id="joinCode"
              label="JoinCode:"
              placeholder="Enter joinCode:"
              type="text"
              {...register("joinCode", {
                required: "JoinCode is required!", // Required joinCode field
              })}
              readOnly
              value={joinCode} // Controlled value for joinCode input
            />
            <div
              className={
                pageStyles["workspace-basic-content-window__form__join"]
              }
            >
              <Button
                type="button"
                fullWidth
                block
                onClick={(e) => {
                  e.preventDefault();
                  generateJoinCode(); // Regenerate joinCode on button click
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
            {/* NOTE: Button is currently type="button" */}
            <Button type="button" block>
              Create Organization
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
