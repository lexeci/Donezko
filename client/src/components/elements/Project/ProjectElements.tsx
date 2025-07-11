"use client";

import pageStyles from "@/app/page.module.scss";
import {
  Button,
  EntityItem,
  LackPermission,
  ModalWindow,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useFetchProjects } from "@/hooks/project/useFetchProjects";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { AccessStatus } from "@/src/types/root.types";
import { OrgRole } from "@/types/org.types";
import { Project } from "@/types/project.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Buildings, CoinVertical } from "@phosphor-icons/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ProjectCreate from "./ProjectCreate";
import styles from "./ProjectElements.module.scss";

/**
 * Props for ProjectElements component
 *
 * @property {boolean} [isWindowElement] - Flag to render as a window element with specific styles
 * @property {string} [organizationId] - Organization ID to fetch projects for (optional if context provides it)
 * @property {string} [organizationTitle] - Title of the organization (for display in modals etc)
 * @property {Project[]} [projects] - Optional list of projects (if already fetched or passed down)
 * @property {boolean} [isAdministrate] - Override for admin permission (otherwise fetched from org role)
 */
interface ProjectElementsProps {
  isWindowElement?: boolean;
  organizationId?: string;
  organizationTitle?: string;
  projects?: Project[];
  isAdministrate?: boolean;
}

/**
 * Internal component to render a list of project items.
 *
 * @param {object} props - Props
 * @param {Project[]} props.projects - List of projects to render
 * @param {boolean} [props.canAdministrate] - Whether the user can administrate projects (affects link visibility)
 * @returns JSX.Element
 */
const ProjectElementsItem = ({
  projects,
  canAdministrate,
}: {
  projects: Project[];
  canAdministrate?: boolean;
}) => {
  return projects?.length > 0 ? (
    projects.map((project, i) => {
      const { _count } = project;
      const access = project.projectUsers?.[0];
      const isGranted = canAdministrate
        ? true
        : access?.projectStatus === AccessStatus.ACTIVE;

      return (
        <EntityItem
          key={generateKeyComp(`${project.title}__${i}`)}
          icon={<Buildings size={84} />}
          linkBase={`${DASHBOARD_PAGES.PROJECTS}/${project.id}`}
          title={project.title}
          firstStat={`Teams: ${_count?.projectTeams}`}
          secondaryStat={`Tasks: ${_count?.tasks}`}
          hideLink={!isGranted}
        />
      );
    })
  ) : (
    <div className={pageStyles["workspace-not-found"]}>
      <h5>There is no project for you</h5>
    </div>
  );
};

/**
 * Main component to display projects within an organization.
 * Handles fetching projects, roles, and rendering create modal.
 *
 * @param {ProjectElementsProps} props - Component props
 * @returns JSX.Element
 *
 * @example
 * <ProjectElements
 *   isWindowElement={true}
 *   organizationTitle="My Organization"
 *   isAdministrate={true}
 * />
 */
export default function ProjectElements({
  isWindowElement,
  organizationTitle,
  isAdministrate,
}: ProjectElementsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [projectCount, setProjectCount] = useState<number>(0);

  // Якщо `organizationId` передано, використовуємо його, інакше виконуємо запит
  const { organizationId } = useOrganization();

  // Якщо `isAdministrate` передано, використовуємо його, інакше перевіряємо роль
  const { organizationRole } = useFetchOrgRole(organizationId);

  // Визначаємо, чи може користувач адміністративно діяти
  const canAdministrate =
    isAdministrate !== undefined
      ? isAdministrate
      : organizationRole &&
        (organizationRole.role === OrgRole.OWNER ||
          organizationRole.role === OrgRole.ADMIN);

  // Отримуємо або передані, або завантажені проекти
  const { projects: projectList, handleRefetch } =
    useFetchProjects(organizationId);

  useEffect(() => {
    setProjectCount(projectList?.length ?? 0);
  }, [projectList]);

  return organizationRole ? (
    organizationRole.role === OrgRole.VIEWER ? (
      <LackPermission />
    ) : (
      <div
        className={clsx(
          pageStyles["workspace-content-col"],
          isWindowElement && styles["is-window"]
        )}
      >
        {/* Модальне вікно */}
        {open && canAdministrate && (
          <ModalWindow
            title="Project manager.exe"
            subtitle="The manager to operate your project"
            onClose={() => setOpen(false)}
          >
            <ProjectCreate
              organizationId={organizationId}
              organizationTitle={organizationTitle}
              handleRefetch={handleRefetch}
              setOpen={setOpen}
            />
          </ModalWindow>
        )}

        {/* Лічильник проєктів та кнопка створення */}
        <div className={pageStyles["workspace-basic-counter"]}>
          <div
            className={clsx(
              styles.title,
              isWindowElement && styles["title__is-window"]
            )}
          >
            <h4>Total Projects: {projectCount}</h4>
          </div>
          {canAdministrate && (
            <Button type="button" onClick={() => setOpen(true)} negative block>
              <Plus size={22} className="mr-4" /> Project
            </Button>
          )}
        </div>

        {/* Відображення проєктів */}
        <div
          className={clsx(
            pageStyles["workspace-content-grid-3"],
            isWindowElement && "!p-0"
          )}
        >
          {projectList && (
            <ProjectElementsItem
              projects={projectList}
              canAdministrate={canAdministrate}
            />
          )}
        </div>
      </div>
    )
  ) : (
    <div className={styles["not-found"]}>
      <CoinVertical size={80} className="" />
    </div>
  );
}
