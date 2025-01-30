import styles from "@/components/ui/Field/Field.module.scss";
import toCapitalizeText from "@/utils/toCapitalizeText";
import { forwardRef } from "react";

interface SelectFieldProps {
	id: string;
	label?: string;
	placeholder?: string;
	options: { value: string; label: string; selected?: boolean }[];
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Змінено тип
	onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void; // Додано тип
	extra?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectFieldProps>(
	(
		{
			id,
			label,
			placeholder,
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
					onChange={onChange} // Передача події
					onBlur={onBlur} // Передача події
					{...rest}
				>
					{placeholder && <option value="">{placeholder}</option>}
					{options.map(option => (
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
