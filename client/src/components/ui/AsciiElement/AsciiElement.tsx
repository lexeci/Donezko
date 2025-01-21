"use client";

import {useEffect, useState} from "react";
import styles from "./AsciiElement.module.scss";

type AsciiElementTypes =
    | "loading"
    | "progress"
    | "completed"
    | "notStarted"
    | "hold"
    | "conga";

export default function AsciiElement({types}: { types: AsciiElementTypes }) {
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
        completed: ["[....]", "[✓...]", "[.✓..]", "[..✓.]", "[...✓]"], // Completed — статичне заповнення
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

        // Додаємо хмарку для кожного другого кадру
        const interval = setInterval(() => {
            setCurrentFrame(prevFrame => {
                const newFrame = (prevFrame + 1) % frames.length;
                setShowCloud(newFrame % 2 === 0); // Хмарка з'являється на парних кадрах
                return newFrame;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [types]);

    // Якщо тип анімації не підтримується
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
