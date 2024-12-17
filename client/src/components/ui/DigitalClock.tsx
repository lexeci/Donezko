"use client";

import React, { useState, useEffect, useMemo, PropsWithChildren } from "react";

export default function DigitalClock({ children }: PropsWithChildren<unknown>) {
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	// Memoize the formatted time string to avoid redundant calculations
	const formattedTime = useMemo(() => {
		if (!currentTime) return "";

		const hours = currentTime.getHours();
		const amOrPm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM
		const formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format
		const formattedMinutes = currentTime
			.getMinutes()
			.toString()
			.padStart(2, "0");
		const formattedSeconds = currentTime
			.getSeconds()
			.toString()
			.padStart(2, "0");

		return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${amOrPm}`;
	}, [currentTime]);

	return (
		<div className="text-sm font-semibold tracking-wide border-l border-l-definerColor pl-6">
			{formattedTime}
		</div>
	);
}
