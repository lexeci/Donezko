"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react/dist/ssr";

import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchProjects } from "@/src/hooks/project/useFetchProjects";
import styles from "./ProjectBoardStatistic.module.scss";

function NotFoundElement() {
	return (
		<div className={styles["error-found"]}>
			<div className={styles.title}>
				<h5>You don't have any projects</h5>
			</div>
			<div className={styles.description}>
				<p>Please join in or create your personal project</p>
			</div>
		</div>
	);
}

export default function ProjectBoardStatistic() {
	const { organizationId } = useOrganization();

	const { projects } = useFetchProjects(organizationId);

	return (
		<StatisticBlock
			title="Your Projects"
			description="Projects with assigned tasks"
			button={{ title: "Show all", link: "/workspace/projects" }}
		>
			{projects ? (
				projects?.length > 0 ? (
					projects?.map((project, i) => {
						const { _count, title, description, id } = project;

						return (
							<StatisticItem
								key={generateKeyComp(`${title}__${i}`)}
								icon={<Buildings size={32} />}
								title={title}
								description={description}
								subtitle={`Participants: ${_count?.projectTeams}`}
								link={{
									href: `/workspace/projects/${id}`,
									text: "Look -->",
								}}
							/>
						);
					})
				) : (
					<NotFoundElement />
				)
			) : (
				<NotFoundElement />
			)}
		</StatisticBlock>
	);
}
