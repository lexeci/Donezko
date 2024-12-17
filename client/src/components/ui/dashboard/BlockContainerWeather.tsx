import { FastWindIcon, RainIcon, SnowIcon, Sun02Icon } from "hugeicons-react";
import BlockContainer from "./BlockContainer";

export default function BlockContainerWeather() {
	return (
		<BlockContainer>
			<div className="title pb-2 border-b border-b-borderColor w-full">
				<h3>Your weather today:</h3>
			</div>
			<div className="weather flex flex-col justify-between items-center w-full h-full">
				<div className="geo-desc flex flex-row flex-wrap justify-between gap-x-3 w-full">
					<div className="city font-mono text-sm">
						<h4>Chernivtsy, Chernivetska Oblast</h4>
					</div>
					<div className="temp font-mono flex flex-row gap-x-3 justify-center items-center">
						<p>22.2C</p>
						<p>Clear</p>
					</div>
				</div>
				<div className="weather-ico flex justify-center items-center h-full">
					<Sun02Icon size={140} className="animate-spin"/>
					{/* <SnowIcon size={140} className="animate-spin"/>
					<RainIcon size={140} className="animate-spin"/>
					<FastWindIcon size={140} className="animate-spin"/> */}
				</div>
			</div>
		</BlockContainer>
	);
}
