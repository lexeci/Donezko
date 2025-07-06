"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import { useFetchAdvice } from "@/hooks/additional/useFetchAdvice";
import { useFetchElonNews } from "@/hooks/additional/useFetchElonNews"; // New hook for fetching Elon Musk news
import { useFetchWeather } from "@/hooks/additional/useFetchWeather";
import { Rss } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";

/**
 * DailyBoardAdvice component fetches and displays daily advice, weather,
 * and Elon Musk news in a statistics block.
 *
 * It uses multiple custom hooks to fetch user profile, advice, weather,
 * and news data, then updates local state accordingly.
 *
 * @returns {JSX.Element} Rendered DailyBoardAdvice component
 */
export default function DailyBoardAdvice() {
  // Fetch user profile data and loading state
  const { profileData, isDataLoaded } = useFetchUserProfile();

  // Fetch daily advice and loading state
  const { advice, isLoading: isLoadingAdvice } = useFetchAdvice();

  // Fetch weather data for user's city if available, otherwise default to "Chernivtsi"
  const { weather, isLoading: isLoadingWeather } = useFetchWeather(
    isDataLoaded
      ? profileData?.user.city
        ? profileData.user.city
        : "Chernivtsi"
      : "Chernivtsi"
  );

  // Fetch Elon Musk news and loading state using new hook
  const { elonNews, isLoading: isLoadingElonNews } = useFetchElonNews();

  // Local state to hold advice, weather, and news info for display
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

  /**
   * Update advices state whenever fetched data or loading states change.
   *
   * Updates each item in advices array with new text and optionally new titles.
   * Handles loading states and fallback texts if data is unavailable.
   */
  useEffect(() => {
    setAdvices((prevAdvices) => [
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
          ? elonNews.title // Display news title if available
          : prevAdvices[2].title,
        text: isLoadingElonNews
          ? "Loading Elon Musk news..."
          : elonNews
          ? elonNews.description // Display news description if available
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
      {/* Render a StatisticItem for each advice entry with icon, title, description, and source */}
      {advices.map((advice, i) => (
        <StatisticItem
          key={i}
          icon={<Rss size={32} />}
          title={advice.title}
          description={advice.text}
          subtitle={advice.source}
        />
      ))}
    </StatisticBlock>
  );
}
