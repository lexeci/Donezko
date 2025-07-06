import { RadioButton } from "@phosphor-icons/react/dist/ssr";
import { forwardRef } from "react";

import styles from "./Field.module.scss";
import clsx from "clsx";

interface CheckboxFieldProps {
  /** Unique identifier for the checkbox input */
  id: string;
  /** Optional label text displayed next to the checkbox */
  label?: string;
  /** Optional placeholder (not typical for checkboxes but kept for flexibility) */
  placeholder?: string;
  /** Value attribute of the checkbox */
  value?: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Change event handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Additional CSS classes for container */
  extra?: string;
}

/**
 * Checkbox component with label and custom styling.
 * Uses a RadioButton icon to visually indicate checked state via CSS peer selectors.
 * Supports forwarding ref to the underlying input element.
 *
 * @param {CheckboxFieldProps} props - Component properties
 * @returns {JSX.Element} Checkbox with label and custom styling
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      id,
      label,
      placeholder,
      value,
      checked,
      onChange,
      onBlur,
      extra,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={clsx(styles.checkbox, extra)}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles["checkbox__container"]}>
          <input
            type="checkbox"
            ref={ref}
            id={id}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            value={value}
            checked={checked}
            className={clsx(styles["checkbox__container__input"], "peer")}
            {...rest}
          />
          <RadioButton
            className={clsx(styles["checkbox__radio"], "peer-checked:visible")}
          />
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
