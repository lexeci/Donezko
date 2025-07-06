"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./DigitalClock.module.scss";

/**
 * DigitalClock component displays the current time in 12-hour format with AM/PM.
 * The time updates every second.
 *
 * @component
 * @example
 * return <DigitalClock />;
 *
 * @returns {JSX.Element | null} The formatted digital clock or null if time is not initialized yet.
 */
export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null); // Initial state is null

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // Update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Set time immediately on mount
    updateTime();

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Memoize formatted time to avoid unnecessary recalculations
  const formattedTime = useMemo(() => {
    if (!currentTime) return null;

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    return {
      hours: String(hours % 12 || 12).padStart(2, "0"), // 12-hour format
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      amOrPm: hours >= 12 ? "PM" : "AM",
    };
  }, [currentTime]);

  // Render nothing until time is initialized
  if (!formattedTime) {
    return null;
  }

  return (
    <div
      className={styles["digital-clock"]}
      role="timer"
      aria-label={`Current time is ${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds} ${formattedTime.amOrPm}`}
    >
      <span className={styles["hours"]}>{formattedTime.hours}</span>
      <span className={styles["separator"]}>:</span>
      <span className={styles["minutes"]}>{formattedTime.minutes}</span>
      <span className={styles["separator"]}>:</span>
      <span className={styles["seconds"]}>{formattedTime.seconds}</span>
      <span className={styles["am-pm"]}> {formattedTime.amOrPm}</span>
    </div>
  );
}
