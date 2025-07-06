"use client";

import pageStyles from "@/app/page.module.scss";
import { Button, Field } from "@/components/index";
import { useUpdateTeam } from "@/hooks/team/useUpdateTeam";
import { useOrganization } from "@/src/context/OrganizationContext";
import { Team, TeamFormData } from "@/types/team.types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TeamUpdateProps {
  /** Team ID to update */
  id: string;

  /** Initial team data (title, description) to prefill form */
  data: TeamFormData;

  /** Callback to send updated data back to parent */
  pullUpdatedData: Dispatch<SetStateAction<Team | undefined>>;

  /** Callback to close modal */
  pullCloseModal: Dispatch<SetStateAction<boolean>>;
}

/**
 * TeamUpdate component renders a form to update
 * team title and description.
 * Uses react-hook-form for validation and submission handling.
 *
 * @param {TeamUpdateProps} props - Component props
 * @returns JSX.Element
 */
export default function TeamUpdate({
  id,
  data: localData,
  pullUpdatedData,
  pullCloseModal,
}: TeamUpdateProps) {
  // Get organizationId from context
  const { organizationId } = useOrganization();

  // Hook to update team, provides update function and updated data
  const { updateTeam, updatedTeam } = useUpdateTeam();

  // Initialize react-hook-form methods
  const { register, handleSubmit, setValue, reset } = useForm<TeamFormData>({
    mode: "onChange",
  });

  // Prefill form fields on mount or when data changes
  useEffect(() => {
    setValue("title", localData.title);
    setValue("description", localData.description);
  }, [localData, setValue]);

  /**
   * Form submit handler.
   * Calls updateTeam with form data and org context.
   *
   * @param {TeamFormData} data - Submitted form data
   */
  const onSubmit: SubmitHandler<TeamFormData> = (data) => {
    if (organizationId) {
      updateTeam({ id, data, organizationId });
    }
  };

  // Watch for update results,
  // reset form, send updated data to parent,
  // and close modal on success
  useEffect(() => {
    if (updatedTeam?.team.id) {
      reset(updatedTeam.team);
      pullUpdatedData(updatedTeam.team);
      pullCloseModal(false);
    }
  }, [updatedTeam, reset, pullUpdatedData, pullCloseModal]);

  return (
    <div className={pageStyles["workspace-basic-content-window"]}>
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Update your team</h5>
      </div>
      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>Please write the title and description for your team.</p>
      </div>
      <div
        className={pageStyles["workspace-basic-content-window__operate-window"]}
      >
        <form
          className={pageStyles["workspace-basic-content-window__form"]}
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <Field
            extra={pageStyles["workspace-basic-content-window__form__fields"]}
            id="description"
            label="Description:"
            placeholder="Enter description"
            type="text"
            {...register("description", {
              maxLength: { value: 500, message: "Description is too long" },
            })}
          />
          <div
            className={
              pageStyles["workspace-basic-content-window__form__actions"]
            }
          >
            <Button type="button" block>
              Update Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
