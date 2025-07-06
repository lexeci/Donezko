"use client";

import { Button, Field, Select } from "@/components/index";
import { useFetchOrgs } from "@/hooks/organization/useFetchOrgs";
import { useFetchOrgUsers } from "@/hooks/organization/useFetchOrgUsers";
import { useCreateTeam } from "@/hooks/team/useCreateTeam";
import { OrgResponse } from "@/types/org.types";
import { TeamFormData, TeamsResponse } from "@/types/team.types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import pageStyles from "@/app/page.module.scss";

/**
 * TeamCreate Component
 *
 * @module TeamCreate
 * @description
 * UI component that allows users to create a new team within an organization.
 * It fetches available organizations, users, and handles team creation via a form.
 *
 * @param {Object} props
 * @param {string|null} [props.organizationId] - Preselected organization ID (optional)
 * @param {string} [props.organizationTitle] - Preselected organization title (optional)
 * @param {(newTeam: TeamsResponse) => void} props.setTeams - Callback triggered when a new team is created
 *
 * @returns {JSX.Element} Rendered team creation form or fallback UI
 *
 * @example
 * <TeamCreate
 *   organizationId="abc123"
 *   organizationTitle="Acme Org"
 *   setTeams={(newTeam) => console.log(newTeam)}
 * />
 */
export default function TeamCreate({
  organizationId: localOrgId,
  organizationTitle: localOrgTitle,
  setTeams,
}: {
  organizationId?: string | null;
  organizationTitle?: string;
  setTeams: (newTeam: TeamsResponse) => void;
}) {
  const [organizations, setOrganizations] = useState<OrgResponse[]>();
  const [organizationId, setOrganizationId] = useState<string | undefined>();

  const { organizationList } = useFetchOrgs(); // Fetch all organizations
  const { createTeam, newTeam } = useCreateTeam(); // Hook to create a team

  const { organizationUserList } = useFetchOrgUsers({
    organizationId,
    hideFromTeam: true,
  }); // Fetch users for selected org (excluding current team members)

  const { register, handleSubmit, reset, setValue } = useForm<TeamFormData>({
    mode: "onChange",
  });

  /**
   * Handles selection of a team leader from dropdown
   * @param {string} value - Selected userId
   * @returns {void}
   */
  const handleUserSelect = (value: string): void => {
    setValue("teamLeaderId", value);
  };

  /**
   * Handles form submission by passing data to createTeam hook
   * @function
   * @param {TeamFormData} data - Form input values
   * @returns {void}
   */
  const onSubmit: SubmitHandler<TeamFormData> = (data): void => {
    createTeam(data);
  };

  /**
   * Syncs local prop `organizationId` with internal state and form
   */
  useEffect(() => {
    if (localOrgId) {
      setOrganizationId(localOrgId);
      setValue("organizationId", localOrgId);
    } else {
      setOrganizationId(organizationId);
    }
  }, [localOrgId, organizationId]);

  /**
   * Updates local state once organization list is fetched
   */
  useEffect(() => {
    if (organizationList) {
      setOrganizations(organizationList);
    }
  }, [organizationList]);

  /**
   * Resets the form after a team is successfully created
   */
  useEffect(() => {
    if (newTeam?.id) {
      reset(); // Clear form inputs
      setValue("organizationId", organizationId); // Restore org ID
      setTeams && setTeams(newTeam); // Notify parent component
    }
  }, [newTeam]);

  return (
    <div className={pageStyles["workspace-basic-content-window"]}>
      <div className={pageStyles["workspace-basic-content-window__title"]}>
        <h5>Create your own team</h5>
      </div>

      <div className={pageStyles["workspace-basic-content-window__text-block"]}>
        <p>Please write the title and description for your team.</p>
      </div>

      <div
        className={pageStyles["workspace-basic-content-window__operate-window"]}
      >
        {organizations && organizationUserList ? (
          organizationUserList?.length > 0 ? (
            <form
              className={pageStyles["workspace-basic-content-window__form"]}
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Team Title */}
              <Field
                extra={
                  pageStyles["workspace-basic-content-window__form__fields"]
                }
                id="title"
                label="Title:"
                placeholder="Enter title:"
                type="text"
                {...register("title", {
                  required: "Title is required!",
                })}
              />

              {/* Team Description */}
              <Field
                extra={
                  pageStyles["workspace-basic-content-window__form__fields"]
                }
                id="description"
                label="Description:"
                placeholder="Enter description"
                type="text"
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description is too long",
                  },
                })}
              />

              {/* Team Leader Select */}
              {organizationUserList && (
                <Select
                  extra={
                    pageStyles["workspace-basic-content-window__form__fields"]
                  }
                  id="leader-select"
                  label="Select Leader:"
                  placeholder="Choose a leader"
                  options={organizationUserList.map((item) => ({
                    value: item.userId,
                    label: item.user.name,
                  }))}
                  onChange={(e) => handleUserSelect(e.target.value)}
                />
              )}

              {/* Create Button */}
              <div
                className={
                  pageStyles["workspace-basic-content-window__form__actions"]
                }
              >
                <Button type="button" block disabled={!organizationId}>
                  Create Team
                </Button>
              </div>
            </form>
          ) : (
            <div
              className={
                pageStyles["workspace-basic-content-window__text-block"]
              }
            >
              <p>You cannot create a team due lack of members</p>
            </div>
          )
        ) : (
          <div
            className={pageStyles["workspace-basic-content-window__text-block"]}
          >
            <p>You cannot create a team due lack of members</p>
          </div>
        )}
      </div>
    </div>
  );
}
