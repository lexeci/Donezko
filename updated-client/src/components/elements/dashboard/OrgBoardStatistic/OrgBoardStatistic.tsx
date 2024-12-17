import { StatisticBlock, StatisticItem } from "@/components/index";
import { Buildings } from "@phosphor-icons/react/dist/ssr";

const orgs = [
	{
		link: "/workspace/org/1234",
		title: "Insomnia Organization",
		description: "The organization of insomnia and coffee",
		tasks: 5,
		teams: 29,
	},
	{
		link: "/workspace/org/5678",
		title: "Creative Org",
		description: "The organization of insomnia and coffee",
		tasks: 12,
		teams: 6,
	},
];

export default function OrgBoardStatistic() {
	return (
		<StatisticBlock
			title="Your Organizations"
			description="Organizations with assigned tasks"
			button={{ title: "Show all", link: "/workspace/organization" }}
		>
			{orgs.map((org, i) => (
				<StatisticItem
					key={i}
					icon={<Buildings size={32} />}
					title={org.title}
					description={org.description}
					subtitle={`Teams: ${org.teams} | Tasks: ${org.tasks}`}
					link={{ href: org.link, text: "Look -->" }}
				/>
			))}
		</StatisticBlock>
	);
}
