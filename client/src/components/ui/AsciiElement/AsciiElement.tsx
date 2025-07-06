"use client";

import { useEffect, useState } from "react";
import styles from "./AsciiElement.module.scss";

type AsciiElementTypes =
  | "loading"
  | "progress"
  | "completed"
  | "notStarted"
  | "hold"
  | "conga";

interface AsciiElementProps {
  /** Animation type to display */
  types: AsciiElementTypes;
}

/**
 * AsciiElement component renders ASCII art animations based on the provided type.
 * It cycles through predefined frames with a fixed interval.
 *
 * @param {AsciiElementProps} props - Component props.
 * @returns {JSX.Element} Animated ASCII art element.
 *
 * @example
 * <AsciiElement types="loading" />
 *
 * <AsciiElement types="conga" />
 */
export default function AsciiElement({ types }: AsciiElementProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showCloud, setShowCloud] = useState(false);

  const animations = {
    loading: [
      "[>    ]",
      "[>>   ]",
      "[>>>  ]",
      "[ >>> ]",
      "[  >>>]",
      "[   >>]",
      "[    >]",
    ],
    progress: [
      "[    ]",
      "[=   ]",
      "[==  ]",
      "[=== ]",
      "[====]",
      "[ ===]",
      "[  ==]",
      "[   =]",
    ],
    completed: ["[....]", "[✓...]", "[.✓..]", "[..✓.]", "[...✓]"],
    notStarted: [
      "[....]",
      "[>...]",
      "[.>..]",
      "[..>.]",
      "[...>]",
      "[....]",
      "[...<]",
      "[..<.]",
      "[.<..]",
      "[<...]",
      "[....]",
    ],
    hold: ["[>--<]", "[-<>-]", "[--<>]"],
    conga: [
      `
  (•_•)
  <)  )╯
  /  \\ `,
      `
  (•_•)
 \\(  (>
   /  \\`,
      `
  (ಠ_ಠ)
  <)   )╯
   /  \\`,
      `
  (ಠ_ಠ)
  <)  )
   /  \\`,
      `
(•_•)
\\(  (>
  \\ /`,
      `
(•_•)
<)  )╯
 \\ \\`,
      `
(•_•)
<)  )╯
  \\ \\`,
      `
  (•_•)
 \\(  (>
   /   /`,
    ],
  };

  useEffect(() => {
    const frames = animations[types];
    if (!frames) return;

    // Cycle through frames every 500ms and toggle showCloud on even frames
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => {
        const newFrame = (prevFrame + 1) % frames.length;
        setShowCloud(newFrame % 2 === 0);
        return newFrame;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [types]);

  if (!animations[types]) {
    return <div>Animation type not supported</div>;
  }

  return (
    <div className={styles["ascii-element"]}>
      <div className={styles["ascii-element__loader"]}>
        <pre>{animations[types][currentFrame]}</pre>
      </div>
    </div>
  );
}
