"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import { useFetchAdvice } from "@/hooks/additional/useFetchAdvice";
import { useFetchElonNews } from "@/hooks/additional/useFetchElonNews"; // Новий хук
import { useFetchWeather } from "@/hooks/additional/useFetchWeather";
import { Rss } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

export default function DailyBoardAdvice() {
	const { advice, isLoading: isLoadingAdvice } = useFetchAdvice();
	const { weather, isLoading: isLoadingWeather } =
		useFetchWeather("Chernivtsi");
	const { elonNews, isLoading: isLoadingElonNews } = useFetchElonNews(); // Використання нового хуку

	const [advices, setAdvices] = useState([
		{
			title: "Your advice today",
			source: "adviceslip.com",
			text: "",
		},
		{
			title: "Your weather today",
			source: "weatherapi.com",
			text: "",
		},
		{
			title: "Elon Musk News",
			source: "elonmu.sh",
			text: "",
		},
	]);

	useEffect(() => {
		setAdvices(prevAdvices => [
			{
				...prevAdvices[0],
				text:
					advice?.slip.advice ||
					(isLoadingAdvice ? "Loading advice..." : "No advice available."),
			},
			{
				...prevAdvices[1],
				text: weather
					? `${weather.location.name}: ${weather.current.temp_c}°C | ${weather.current.condition.text} | Wind: ${weather.current.wind_kph} km/h`
					: isLoadingWeather
					? "Loading weather..."
					: "Weather data not available.",
			},
			{
				...prevAdvices[2],
				title: isLoadingElonNews
					? prevAdvices[2].title
					: elonNews
					? elonNews.title // Виводимо заголовок новини
					: prevAdvices[2].title,
				text: isLoadingElonNews
					? "Loading Elon Musk news..."
					: elonNews
					? elonNews.description // Виводимо опис новини
					: "No news available.",
			},
		]);
	}, [
		advice,
		weather,
		elonNews,
		isLoadingAdvice,
		isLoadingWeather,
		isLoadingElonNews,
	]);

	return (
		<StatisticBlock
			title="Daily Advice"
			description="Advices that are nothing to do with your work"
		>
			{advices.map((advice, i) => (
				<StatisticItem
					key={i}
					icon={<Rss size={32} className="w-11 h-11" />}
					title={advice.title}
					description={advice.text}
					subtitle={advice.source}
				/>
			))}
		</StatisticBlock>
	);
}
