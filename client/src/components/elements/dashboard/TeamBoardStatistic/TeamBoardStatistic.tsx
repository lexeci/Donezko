import { StatisticBlock, StatisticItem } from "@/components/index";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";

const teams = [
	{
		link: "/workspace/teams/1234",
		title: "Insomnia Work",
		description: "We are doing nothing ...",
		participants: 5,
		tasks: 29,
	},
	{
		link: "/workspace/teams/5678",
		title: "Creative Team",
		description: "We are doing nothing ...",
		participants: 8,
		tasks: 18,
	},
];

export default function TeamBoardStatistic() {
	return (
		<StatisticBlock
			title="Your Teams"
			description="Teams with assigned tasks"
			button={{ title: "Show all", link: "/workspace/teams" }}
		>
			{teams.map((team, i) => (
				<StatisticItem
					key={i}
					icon={<UsersThree size={32} />}
					title={team.title}
					description={team.description}
					subtitle={`Users: ${team.participants} | Tasks: ${team.tasks}`}
					link={{ href: team.link, text: "Look -->" }}
				/>
			))}
		</StatisticBlock>
	);
}
