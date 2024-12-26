import toCapitalizeText from "@/src/utils/toCapitalizeText";
import { forwardRef } from "react";

interface SelectFieldProps {
	id: string;
	label?: string;
	placeholder?: string;
	options: { value: string; label: string }[];
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
					<label htmlFor={id} className="text-sm text-foreground font-mono">
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={id}
					className="bg-background h-10 border border-foreground border-b-2 border-r-4 border-t-2 px-4 py-2 text-sm"
					value={value}
					onChange={onChange} // Передача події
					onBlur={onBlur} // Передача події
					{...rest}
				>
					{placeholder && <option value="">{placeholder}</option>}
					{options.map(option => (
						<option key={option.value} value={option.value}>
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
