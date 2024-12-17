import cn from "clsx";
import { type InputHTMLAttributes, forwardRef } from "react";

import styles from "./TransparentField.module.scss";

type TransparentFieldProps = InputHTMLAttributes<HTMLInputElement>;

const TransparentField = forwardRef<HTMLInputElement, TransparentFieldProps>(
	({ className, placeholder = "Enter text...", ...rest }, ref) => {
		return (
			<input
				className={cn(styles["transparent-field"], className)}
				ref={ref}
				placeholder={placeholder}
				{...rest}
			/>
		);
	}
);

TransparentField.displayName = "TransparentField";

export default TransparentField;
