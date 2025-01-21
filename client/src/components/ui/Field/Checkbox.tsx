import {RadioButton} from "@phosphor-icons/react/dist/ssr";
import {forwardRef} from "react";

import styles from "./Field.module.scss";
import clsx from "clsx";

interface CheckboxFieldProps {
    id: string;
    label?: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Змінено тип
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; // Додано тип
    extra?: string;
}

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
            <div
                className={styles.checkbox}
            >
                {label && (
                    <label htmlFor={id} className={styles.label}>
                        {label}
                    </label>
                )}
                <div
                    className={styles["checkbox__container"]}>
                    <input
                        type="checkbox"
                        ref={ref}
                        id={id}
                        onChange={onChange} // Передача події
                        onBlur={onBlur} // Передача події
                        placeholder={placeholder}
                        value={value}
                        checked={checked}
                        className={clsx(styles["checkbox__container__input"], 'peer')}
                        {...rest}
                    />
                    <RadioButton className={clsx(styles["checkbox__radio"], 'peer-checked:visible')}/>
                </div>
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
