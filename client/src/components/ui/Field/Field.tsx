import { forwardRef } from "react";
import styles from "@/components/ui/Field/Field.module.scss";

interface InputFieldProps {
  /** Unique identifier for the input element */
  id: string;
  /** Optional label text shown above the input */
  label?: string;
  /** Additional CSS classes for container */
  extra?: string;
  /** Placeholder text shown inside the input */
  placeholder: string;
  /** Visual variant of the input (currently unused but reserved) */
  variant?: string;
  /** Visual state to show error or success styling */
  state?: "error" | "success";
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Input type, restricted to common HTML input types */
  type?: "text" | "number" | "email" | "password";
  /** If true, restricts input to numeric characters only */
  isNumber?: boolean;
  /** If true, makes the input read-only */
  readOnly?: boolean;
  /** Controlled value of the input */
  value?: any;
}

/**
 * Field component renders a labeled input element with optional validation states,
 * disabled and read-only modes, and numeric input restriction.
 *
 * Supports forwarding ref to the underlying input element.
 *
 * @param {InputFieldProps} props - Component props
 * @returns {JSX.Element} Labeled input field with custom styles and behavior
 */
const Field = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      extra,
      type = "text",
      placeholder,
      state,
      disabled,
      isNumber,
      readOnly,
      value,
      ...rest
    },
    ref
  ) => {
    // Restrict input to numbers if isNumber=true
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        isNumber &&
        !/[0-9]/.test(event.key) &&
        !["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(
          event.key
        )
      ) {
        event.preventDefault();
      }
    };

    // Prevent non-numeric changes (extra guard, can be optional)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumber && isNaN(Number(event.target.value))) {
        event.preventDefault();
      }
    };

    return (
      <div className={extra}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          type={type}
          id={id}
          placeholder={placeholder}
          className={`${styles.field} ${
            disabled
              ? "border-gray-300"
              : state === "error"
              ? "border-red-300"
              : state === "success"
              ? "border-green-300"
              : "cursor-default opacity-60"
          }`}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          readOnly={readOnly}
          value={value}
          {...rest}
        />
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;
