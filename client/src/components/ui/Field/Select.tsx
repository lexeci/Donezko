import styles from "@/components/ui/Field/Field.module.scss";
import toCapitalizeText from "@/utils/toCapitalizeText";
import { forwardRef } from "react";

interface SelectFieldProps {
  /** Unique identifier for the select element */
  id: string;
  /** Optional label text displayed above the select */
  label?: string;
  /** Placeholder text shown as the first option */
  placeholder?: string;
  /** Default selected value */
  defaultValue?: string | number | readonly string[] | undefined;
  /** Options for the select dropdown */
  options: { value: string; label: string; selected?: boolean }[];
  /** Controlled value */
  value?: string;
  /** Change event handler */
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  /** Additional CSS classes for container */
  extra?: string;
}

/**
 * Select component renders a customizable dropdown field with label, placeholder, and options.
 *
 * Supports both controlled and uncontrolled modes via `value` and `defaultValue`.
 * Accepts forwardRef for direct DOM access.
 *
 * @param {SelectFieldProps} props - Component props
 * @returns {JSX.Element} The select dropdown element with optional label
 */
const Select = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      id,
      label,
      placeholder,
      defaultValue,
      options,
      value,
      onChange,
      onBlur,
      extra,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`${extra}`}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={styles.select}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          defaultValue={defaultValue}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              selected={option.selected}
            >
              {toCapitalizeText(option.label)}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
