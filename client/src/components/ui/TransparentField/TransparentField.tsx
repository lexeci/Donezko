import cn from "clsx"; // Utility for conditional class names
import { type InputHTMLAttributes, forwardRef } from "react"; // React types and forwardRef API

import styles from "./TransparentField.module.scss"; // Import CSS module for styling

// Define the prop types for TransparentField by extending native input props
type TransparentFieldProps = InputHTMLAttributes<HTMLInputElement>;

// Define the TransparentField component, forwarding ref to the underlying input element
const TransparentField = forwardRef<HTMLInputElement, TransparentFieldProps>(
  (
    {
      className, // Optional additional className(s) from parent
      placeholder = "Enter text...", // Default placeholder if none provided
      ...rest // Rest of input props (e.g. onChange, value)
    },
    ref // Forwarded ref for direct DOM access to input
  ) => {
    return (
      <input
        className={cn(styles["transparent-field"], className)} // Merge module class with any extra classes
        ref={ref} // Attach forwarded ref here
        placeholder={placeholder} // Placeholder text for input
        {...rest} // Spread remaining props
      />
    );
  }
);

// Set a display name for easier debugging in React DevTools
TransparentField.displayName = "TransparentField";

export default TransparentField;
