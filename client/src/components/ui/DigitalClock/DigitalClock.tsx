"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./DigitalClock.module.scss";

export default function DigitalClock() {
	const [currentTime, setCurrentTime] = useState<Date | null>(null); // Початковий стан null

	useEffect(() => {
		const updateTime = () => {
			setCurrentTime(new Date());
		};

		// Оновлюємо час щосекунди
		const intervalId = setInterval(updateTime, 1000);

		// Встановлюємо час відразу при першому рендері
		updateTime();

		// Чистимо інтервал після демонтажу
		return () => clearInterval(intervalId);
	}, []);

	// Форматуємо час з використанням useMemo
	const formattedTime = useMemo(() => {
		if (!currentTime) return null;

		const hours = currentTime.getHours();
		const minutes = currentTime.getMinutes();
		const seconds = currentTime.getSeconds();

		return {
			hours: String(hours % 12 || 12).padStart(2, "0"), // 12-годинний формат
			minutes: String(minutes).padStart(2, "0"),
			seconds: String(seconds).padStart(2, "0"),
			amOrPm: hours >= 12 ? "PM" : "AM",
		};
	}, [currentTime]);

	// Виводимо дані
	if (!formattedTime) {
		return null; // Нічого не рендеримо, поки стан не буде оновлений
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
