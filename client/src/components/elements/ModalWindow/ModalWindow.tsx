"use client";

import { WindowContainer } from "@/components/index";
import { PropsWithChildren } from "react";

import styles from "./ModalWindow.module.scss";

interface ModalWindowProps {
  title: string; // Main title displayed in the modal header
  subtitle: string; // Subtitle displayed under the main title
  onClose: () => void; // Callback function triggered when the modal is requested to close
}

/**
 * ModalWindow component wraps its children content inside a modal
 * styled container with a header (title, subtitle) and close functionality.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The main title text shown in the modal header
 * @param {string} props.subtitle - The subtitle text shown below the main title
 * @param {React.ReactNode} props.children - The content to display inside the modal body
 * @param {() => void} props.onClose - Function to call when closing the modal
 * @returns {JSX.Element} The modal window UI element
 */
export default function ModalWindow({
  title,
  subtitle,
  children,
  onClose,
}: PropsWithChildren<ModalWindowProps>) {
  return (
    <div className={styles["modal-window"]}>
      {/* Container for the modal content and header */}
      <div className={styles.container}>
        <WindowContainer
          title={title}
          subtitle={subtitle}
          fullPage
          onClose={onClose}
        >
          {/* Render the modal's child content */}
          {children}
        </WindowContainer>
      </div>
    </div>
  );
}
