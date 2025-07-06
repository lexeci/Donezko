"use client";

import { Button, Field } from "@/components/index";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import { ProjectFormData, ProjectResponse } from "@/types/project.types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import pageStyles from "@/app/page.module.scss";

/**
 * Props for ProjectUpdate component
 */
interface ProjectUpdate {
  /** Project unique ID */
  id: string;
  /** Organization unique ID */
  organizationId: string;
  /** Initial project data to prefill the form */
  data: ProjectFormData;
  /** Callback to refresh project data after update */
  pullUpdatedData: () => void;
  /** Callback to close the modal window */
  pullCloseModal: Dispatch<SetStateAction<boolean>>;
}

/**
 * ProjectUpdate component
 *
 * Provides a form for updating project title and description.
 * Uses react-hook-form for handling form state and validation.
 *
 * @param {ProjectUpdate} props - Component props
 * @returns JSX.Element
 *
 * @example
 * <ProjectUpdate
 *    id="project1"
 *    organizationId="org1"
 *    data={{title: "My project", description: "Description"}}
 *    pullUpdatedData={() => refreshData()}
 *    pullCloseModal={(value) => setModalOpen(value)}
 * />
 */
export default function ProjectUpdate({
  id,
  organizationId,
  data: localData,
  pullUpdatedData,
  pullCloseModal,
}: ProjectUpdate) {
  const { updateProject, updatedProject } = useUpdateProject();

  const { register, handleSubmit, setValue, reset } = useForm<ProjectFormData>({
    mode: "onChange",
  });

  useEffect(() => {
    setValue("title", localData.title);
    setValue("description", localData.description);
  }, []);

  const onSubmit: SubmitHandler<ProjectFormData> = (localData) => {
    updateProject(
      {
        id,
        data: {
          organizationId,
          title: localData.title,
          description: localData.description,
        },
      },
      {
        onSuccess: (updatedProject) => {
          reset(updatedProject?.project);
          pullUpdatedData();
          pullCloseModal(false);
        },
      }
    );
  };

  return (
    <div className={pageStyles["workspace-basic-content-window"]}>
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Update your project</h5>
      </div>
      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>Please write the title and description for your project.</p>
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
              Update Organization
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
