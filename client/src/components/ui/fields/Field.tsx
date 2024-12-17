import { forwardRef } from "react";

interface InputFieldProps {
	id: string;
	label: string;
	extra?: string;
	placeholder: string;
	variant?: string;
	state?: "error" | "success";
	disabled?: boolean;
	type?: string;
	isNumber?: boolean;
}

export const Field = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{ label, id, extra, type, placeholder, state, disabled, isNumber, ...rest },
		ref
	) => {
		return (
			<div className={`${extra}`}>
				<label
					htmlFor={id}
					className={`text-sm text-borderColor font-mono`}
				>
					{label}
				</label>
				<input
					ref={ref}
					disabled={disabled}
					type={type}
					id={id}
					placeholder={placeholder}
					className={`flex items-center text-sm text-foreground gap-3.5
						bg-transparent font-medium w-full p-2 border border-borderColor h-auto transition-all ease-in-out duration-200 outline-none placeholder:text-borderColor placeholder:font-mono placeholder:font-normal focus:border-primary ${
						disabled === true
							? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
							: state === "error"
							? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
							: state === "success"
							? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
							: ""
					}`}
					onKeyDown={event => {
						if (
							isNumber &&
							!/[0-9]/.test(event.key) &&
							event.key !== "Backspace" &&
							event.key !== "Tab" &&
							event.key !== "Enter" &&
							event.key !== "ArrowLeft" &&
							event.key !== "ArrowRight"
						) {
							event.preventDefault();
						}
					}}
					{...rest}
				/>
			</div>
		);
	}
);

Field.displayName = "field";
