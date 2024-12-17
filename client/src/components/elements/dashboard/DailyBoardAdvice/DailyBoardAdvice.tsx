import { StatisticBlock, StatisticItem } from "@/components/index";
import { Rss } from "@phosphor-icons/react/dist/ssr";

const advices = [
	{
		title: "Your advice today",
		source: "The dad advice api",
		text: "Sometimes be prepared to show you panties.",
	},
	{
		title: "Your weather today",
		source: "TheWeatherMap",
		text: "Chernivtsy: 18+ | Clouds | Wind: 34km/h",
	},
	{
		title: "Your news today",
		source: "The New York Times",
		text: "The most popular ai tool...",
	},
];

export default function DailyBoardAdvice() {
	return (
		<StatisticBlock
			title="Daily Advice"
			description="Advices that are nothing to do with your work"
		>
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
