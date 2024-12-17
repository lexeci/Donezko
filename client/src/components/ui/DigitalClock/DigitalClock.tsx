"use client";

import { useEffect, useState } from "react";
import styles from "./DigitalClock.module.scss";

export default function DigitalClock() {
	// Використовуємо один об'єкт у useState для зберігання часу
	const [time, setTime] = useState({
		hours: "00",
		minutes: "00",
		seconds: "00",
		amOrPm: "AM",
	});

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const currentHours = now.getHours();
			const currentMinutes = now.getMinutes();
			const currentSeconds = now.getSeconds();

			// Оновлюємо стан єдиним об'єктом
			setTime({
				hours: String(currentHours % 12 || 12).padStart(2, "0"), // 12-годинний формат
				minutes: String(currentMinutes).padStart(2, "0"),
				seconds: String(currentSeconds).padStart(2, "0"),
				amOrPm: currentHours >= 12 ? "PM" : "AM",
			});
		};

		// Оновлюємо час щосекунди
		const intervalId = setInterval(updateTime, 1000);

		// Запускаємо відразу при першому рендері
		updateTime();

		// Чистимо інтервал після демонтажу
		return () => clearInterval(intervalId);
	}, []);

	// Виводимо дані
	return (
		<div
			className={styles["digital-clock"]}
			role="timer"
			aria-label={`Current time is ${time.hours}:${time.minutes}:${time.seconds} ${time.amOrPm}`}
		>
			<span className={styles["hours"]}>{time.hours}</span>
			<span className={styles["separator"]}>:</span>
			<span className={styles["minutes"]}>{time.minutes}</span>
			<span className={styles["separator"]}>:</span>
			<span className={styles["seconds"]}>{time.seconds}</span>
			<span className={styles["am-pm"]}> {time.amOrPm}</span>
		</div>
	);
}
