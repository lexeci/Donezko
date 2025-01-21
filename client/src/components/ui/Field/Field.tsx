import {forwardRef} from "react";
import styles from "@/components/ui/Field/Field.module.scss";

interface InputFieldProps {
    id: string;
    label?: string;
    extra?: string;
    placeholder: string;
    variant?: string;
    state?: "error" | "success";
    disabled?: boolean;
    type?: "text" | "number" | "email" | "password"; // Restricted to valid types
    isNumber?: boolean;
    readOnly?: boolean;
    value?: any;
}

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

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isNumber && isNaN(Number(event.target.value))) {
                event.preventDefault();
            }
        };

        return (
            <div className={extra}>
                {label &&
                    <label htmlFor={id} className={styles.label}>
                        {label}
                    </label>
                }
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
