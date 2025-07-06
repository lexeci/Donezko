import { PropsWithChildren } from "react";
import styles from "./ActionBlock.module.scss";

/**
 * ActionBlock component wraps its children inside a styled container with a fixed title.
 *
 * @param {PropsWithChildren} props - React props containing children elements to render inside the block.
 *
 * @returns {JSX.Element} A container block with a title "Available actions:" and the provided children.
 *
 * @example
 * <ActionBlock>
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </ActionBlock>
 */
export default function ActionBlock({ children }: PropsWithChildren) {
  return (
    <div className={styles["action-block"]}>
      <div className={styles.title}>
        <h4>Available actions:</h4>
      </div>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
