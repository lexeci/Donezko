import styles from "./checkbox.module.scss";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id?: string;
	extra?: string;
	label?: string; // Added label prop for accessibility
}

export default function Checkbox({
	id,
	extra = "",
	label,
	...rest
}: CheckboxProps) {
	return (
		<div className="flex items-center">
			<input
				id={id}
				type="checkbox"
				className={`${styles.defaultCheckbox} ${extra}`}
				{...rest}
			/>
			{label && (
				<label htmlFor={id} className="ml-2">
					{label}
				</label>
			)}
			{/* Label for accessibility */}
		</div>
	);
}
