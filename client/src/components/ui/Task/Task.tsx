import { formatTimestampToAmPm } from "@/utils/timeFormatter";
import toCapitalizeText from "@/utils/toCapitalizeText";
import { TaskResponse } from "@/types/task.types";
import { CaretUp, ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import AsciiElement from "../AsciiElement/AsciiElement";
import styles from "./Task.module.scss"; // Import css styles

interface TaskElement {
  data?: TaskResponse;
  isBannerElem?: boolean;
}

/**
 * Task component renders detailed information about a task.
 *
 * It displays author, time, title, description, priority, comments count,
 * team, and status with an icon indicator.
 * If `isBannerElem` is true, shows static placeholder content instead of real data.
 *
 * @param {TaskElement} props - Component props.
 * @param {TaskResponse} [props.data] - Optional task data object with task details.
 * @param {boolean} [props.isBannerElem=false] - If true, render placeholder banner content.
 *
 * @returns {JSX.Element} Rendered task UI block.
 */
export default function Task({ data, isBannerElem = false }: TaskElement) {
  const time = data?.updatedAt
    ? formatTimestampToAmPm(data.updatedAt)
    : undefined;

  const returnStatus = () => {
    switch (data?.taskStatus) {
      case "NOT_STARTED":
        return <AsciiElement types="notStarted" />;
      case "IN_PROGRESS":
        return <AsciiElement types="progress" />;
      case "COMPLETED":
        return <AsciiElement types="completed" />;
      case "ON_HOLD":
        return <AsciiElement types="hold" />;

      default:
        return <AsciiElement types="loading" />;
    }
  };

  return (
    <div
      className={clsx(styles.taskKanban, isBannerElem && styles["full-parent"])}
    >
      <div className={styles.topBar}>
        <div className={styles.author}>
          {isBannerElem ? (
            <p>
              <b>Author</b>:
              <br /> Lexeci
            </p>
          ) : (
            data && (
              <p>
                <b>Author</b>:
                <br /> {data.author?.name}
              </p>
            )
          )}
        </div>
        <div className={styles.time}>
          {isBannerElem ? (
            <p>
              <b>
                Time
                <span>:</span>
              </b>
              11:34pm
            </p>
          ) : (
            <p>
              <b>
                Time
                <span>:</span>
              </b>
              {time}
            </p>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <h3>
            <b>
              <span>Task:</span>
            </b>
            {isBannerElem
              ? "Upload this project to Github"
              : data && data.title}
          </h3>
        </div>
        <div className={styles.description}>
          <p>
            {isBannerElem
              ? "It's time to get this project done!"
              : data && data.description}
          </p>
        </div>

        <div className={styles.priority}>
          <p>
            <b>Priority:</b>{" "}
            {isBannerElem
              ? "High"
              : data && toCapitalizeText(data.priority as string)}
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.comments}>
          <p>Complete</p>
          <ThumbsUp />
        </div>
        <div className={`${styles.comments} ${styles.lastComment}`}>
          <p>
            Comments:
            {isBannerElem
              ? 0
              : data && data.comments
              ? data.comments.length
              : 0}
          </p>
          <CaretUp />
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.team}>
          <p>
            <b>Team:</b>{" "}
            {isBannerElem ? "Nightnoctis Labs" : data && data.team?.title}
          </p>
        </div>
        <div className={styles.status}>
          <p>Status: </p> {returnStatus()}
        </div>
      </div>
    </div>
  );
}
