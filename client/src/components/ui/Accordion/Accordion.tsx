"use client";

import { CaretDown, CaretUp } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import styles from "./Accordion.module.scss";

// Interface to describe types
interface Accordion {
  title: string;
  answer: string;
}

/**
 * Accordion component renders a collapsible FAQ item with a clickable header.
 * Clicking the header toggles the visibility of the answer content.
 *
 * @param {Object} props
 * @param {string} props.title - The question or title text displayed in the header.
 * @param {string} props.answer - The answer text displayed when expanded.
 *
 * @returns {JSX.Element} A styled accordion item that toggles open/closed state.
 */
export default function Accordion({ title, answer }: Accordion) {
  // State to track whether the accordion item is open or closed.
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Toggles the open/closed state of the accordion.
  const toggleFAQ = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.accordion}>
      {/* Header section that is clickable to toggle the accordion */}
      <div className={styles["accordion__container"]} onClick={toggleFAQ}>
        <div className={styles["accordion__question"]}>
          <h4>{title}</h4>
          {/* Icon changes depending on whether the accordion is open or closed */}
          <span>
            {isOpen ? <CaretUp size={32} /> : <CaretDown size={32} />}
          </span>
        </div>
      </div>

      {/* Answer section that is conditionally shown based on isOpen */}
      <div
        className={`${styles["accordion__answer"]} ${
          isOpen ? styles["accordion__answer__active"] : ""
        }`}
      >
        <p>
          {"-->"} {answer}
        </p>
      </div>
    </div>
  );
}
