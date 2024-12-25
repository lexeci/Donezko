import { RadioButton } from "@phosphor-icons/react/dist/ssr";
import { forwardRef } from "react";

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
				className={"flex flex-row-reverse justify-center items-center gap-x-2"}
			>
				{label && (
					<label htmlFor={id} className="text-sm text-foreground font-mono">
						{label}
					</label>
				)}
				<div className="checkbox relative flex justify-center items-center h-6 w-6 border-2 border-foreground bg-background">
					<input
						type="checkbox"
						ref={ref}
						id={id}
						className="relative w-full h-full peer shrink-0 bg-background outline-none stroke-none accent-foreground appearance-none checked:bg-foreground transition-all duration-300 cursor-pointer"
						onChange={onChange} // Передача події
						onBlur={onBlur} // Передача події
						placeholder={placeholder}
						value={value}
						checked={checked}
						{...rest}
					/>
					<RadioButton className="absolute w-4 h-4 transition-all duration-300 invisible peer-checked:visible pointer-events-none text-background" />
				</div>
			</div>
		);
	}
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
