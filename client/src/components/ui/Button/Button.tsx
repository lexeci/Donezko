import generateKeyComp from "@/utils/generateKeyComp";
import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  /** Defines if the component is a "link" (anchor) or a "button" */
  type: "link" | "button";
  /** URL to navigate to if type is "link". Defaults to "#" */
  link?: string;
  /** Click event handler */
  onClick?: (e?: any) => void;
  /** Applies a negative style variant */
  negative?: boolean;
  /** Makes the button a block-level element */
  block?: boolean;
  /** Makes the button full width */
  fullWidth?: boolean;
  /** Disables the button */
  disabled?: boolean;
  /** Applies modal styling */
  modal?: boolean;
  /** Enables selectable dropdown menu */
  selectable?: boolean;
  /** Array of selectable options (used only if selectable=true) */
  selectableArray?: { text: string }[];
  /** Click handler for selectable options */
  selectableOnClick?: (selectedText: string) => void;
}

/**
 * Button component that renders either a button, link, or a selectable dropdown style button.
 *
 * @param {ButtonProps & PropsWithChildren} props - Component props.
 * @returns {JSX.Element} Rendered button/link/selectable dropdown.
 *
 * @example
 * <Button type="button" onClick={() => alert('Clicked!')}>
 *   Click Me
 * </Button>
 *
 * <Button type="link" link="/home">
 *   Go Home
 * </Button>
 *
 * <Button
 *   type="button"
 *   selectable
 *   selectableArray={[{ text: 'Option 1' }, { text: 'Option 2' }]}
 *   selectableOnClick={(text) => console.log(text)}
 * >
 *   Select an option
 * </Button>
 */
export default function Button({
  type,
  link = "#",
  onClick,
  children,
  negative = false,
  block = false,
  fullWidth = false,
  disabled = false,
  modal = false,
  selectable = false,
  selectableArray,
  selectableOnClick,
}: PropsWithChildren<ButtonProps>) {
  if (type === "link") {
    return (
      <Link
        className={clsx(
          styles.button,
          negative && styles.negative,
          block && styles.block,
          fullWidth && styles.fullWidth,
          modal && styles.modal
        )}
        href={link}
        onClick={onClick}
      >
        <span>{children}</span>
      </Link>
    );
  }

  if (selectable) {
    return (
      <div
        className={clsx(
          styles.button,
          negative && styles.negative,
          block && styles.block,
          fullWidth && styles.fullWidth,
          modal && styles.modal,
          styles.selectable
        )}
      >
        <span>{children}</span>
        <div className={styles["selectable__container"]}>
          {selectableArray?.map((item, i) => (
            <div
              key={generateKeyComp(`${item.text}__${i}`)}
              className={styles["selectable__item"]}
              onClick={() =>
                selectableOnClick &&
                selectableOnClick(item.text.toLocaleUpperCase())
              }
            >
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      className={clsx(
        styles.button,
        negative && styles.negative,
        block && styles.block,
        fullWidth && styles.fullWidth,
        modal && styles.modal
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}
