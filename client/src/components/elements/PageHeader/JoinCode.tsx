"use client";

import styles from "./PageHeader.module.scss";

import clsx from "clsx"; // Utility for conditional classNames
import { useState } from "react"; // React hook for component state
import { toast } from "sonner"; // Toast notifications for feedback

/**
 * JoinCode component displays a join code and allows users to copy it to clipboard.
 *
 * @param {Object} props - Component props
 * @param {string | boolean} props.joinCode - The join code string or false if unavailable
 * @returns {JSX.Element}
 */
export default function JoinCode({ joinCode }: { joinCode: string | boolean }) {
  // State to track if the join code was recently copied
  const [isCopied, setIsCopied] = useState(false);

  // Handler to copy the join code text to clipboard
  const handleCopy = async () => {
    try {
      // Write the joinCode string to clipboard
      await navigator.clipboard.writeText(joinCode as string);
      setIsCopied(true);
      // Reset the copied status after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err: any) {
      // Show error toast notification if copying fails
      toast.error("Failed to copy text: " + err);
      console.error("Failed to copy text:", err);
    }
  };

  return (
    // Paragraph styled with CSS modules and global class,
    // triggers copy on click
    <p
      className={clsx(styles["join-code"], "bg-radial-grid-mini")}
      onClick={() => handleCopy()}
    >
      {isCopied ? (
        // Show confirmation message if copied
        <span>Join Code copied!</span>
      ) : (
        // Show join code normally
        <span>
          Join Code:<span>{joinCode}</span>
        </span>
      )}
    </p>
  );
}
