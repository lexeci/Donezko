import pageStyles from "@/app/page.module.scss";
import clsx from "clsx";
import styles from "./TaskInfo.module.scss";

/**
 * TaskCreateInfo component renders step-by-step instructions
 * on how to create a new task within a project and team context.
 *
 * It guides users through required and optional fields,
 * providing clear descriptions to facilitate task creation.
 *
 * @returns {JSX.Element} A section with instructions for task creation.
 */
export default function TaskCreateInfo() {
  return (
    <div
      className={clsx(
        pageStyles["workspace-basic-content"],
        styles["info-base"]
      )}
    >
      {/* Header section with title and introductory description */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h5>How to Create a Task</h5>
        </div>
        <div className={styles.description}>
          <p>
            Follow the steps below to create a new task for your project and
            team.
          </p>
        </div>
      </div>

      {/* Main instruction steps with required and optional field details */}
      <div className={pageStyles["workspace-basic-content"]}>
        <p>
          1. Enter a title for the task in the <strong>"Title"</strong> field.
          This is a required field.
        </p>
        <p>
          2. Add a detailed description in the <strong>"Description"</strong>{" "}
          field (optional, max 500 characters).
        </p>
        <p>
          3. Select the <strong>status</strong> of the task from the dropdown
          menu (optional).
        </p>
        <p>
          4. Choose the <strong>priority</strong> for the task from the
          available options (optional).
        </p>
        <p>
          5. From the <strong>"Select Team"</strong> dropdown, choose the team
          responsible for this task.
        </p>
        <p>
          6. If a team is selected, assign a <strong>performer</strong> to the
          task from the list of team members (optional).
        </p>
        <p>
          7. Once all required and optional fields are filled, click the{" "}
          <strong>"Create Task"</strong> button to save the task.
        </p>
      </div>

      {/* Important note reminding user about organization and project requirements */}
      <div className={styles.note}>
        <p>
          Note: You must be part of an organization and have a project selected
          to create a task. Ensure all required fields are completed to avoid
          errors.
        </p>
      </div>
    </div>
  );
}
