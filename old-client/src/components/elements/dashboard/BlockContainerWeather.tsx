import { FastWindIcon, RainIcon, SnowIcon, Sun02Icon } from "hugeicons-react";
import BlockContainer from "./BlockContainer";

interface WeatherData {
	city: string;
	temperature: number;
	condition: string; // e.g., 'Clear', 'Rain', etc.
}

export default function BlockContainerWeather() {
	const { city, temperature, condition } = {
		city: "Chernivtsy",
		temperature: 21,
		condition: "clear",
	};

	const renderWeatherIcon = () => {
		switch (condition.toLowerCase()) {
			case "clear":
				return (
					<Sun02Icon
						size={140}
						className="animate-spin"
						aria-label="Clear weather icon"
					/>
				);
			case "rain":
				return (
					<RainIcon
						size={140}
						className="animate-spin"
						aria-label="Rain weather icon"
					/>
				);
			case "snow":
				return (
					<SnowIcon
						size={140}
						className="animate-spin"
						aria-label="Snow weather icon"
					/>
				);
			case "wind":
				return (
					<FastWindIcon
						size={140}
						className="animate-spin"
						aria-label="Wind weather icon"
					/>
				);
			default:
				return null;
		}
	};

	return (
		<BlockContainer>
			<div className="title pb-2 border-b border-b-borderColor w-full">
				<h3>Your weather today:</h3>
			</div>
			<div className="weather flex flex-col justify-between items-center w-full h-full">
				<div className="geo-desc flex flex-row flex-wrap justify-between gap-x-3 w-full">
					<div className="city font-mono text-sm">
						<h4>{city}</h4>
					</div>
					<div className="temp font-mono flex flex-row gap-x-3 justify-center items-center">
						<p>{temperature.toFixed(1)}°C</p>
						<p>{condition}</p>
					</div>
				</div>
				<div className="weather-ico flex justify-center items-center h-full">
					{renderWeatherIcon()}
				</div>
			</div>
		</BlockContainer>
	);
}
