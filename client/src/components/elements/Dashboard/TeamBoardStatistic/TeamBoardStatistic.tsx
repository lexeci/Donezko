"use client";

import {StatisticBlock, StatisticItem} from "@/components/index";
import {useFetchUserTeams} from "@/hooks/team/useFetchUserTeams";
import {UsersThree} from "@phosphor-icons/react/dist/ssr";

import styles from "./TeamBoardStatistic.module.scss";
import {useOrganization} from "@/context/OrganizationContext";

function NotFoundElement() {
    return (
        <div className={styles["error-found"]}>
            <div className={styles.title}>
                <h5>You don't have any teams</h5>
            </div>
            <div className={styles.description}>
                <p>Please join in or create your personal team</p>
            </div>
        </div>
    );
}

export default function TeamBoardStatistic() {
    const {organizationId} = useOrganization()
    const {userTeamList} = useFetchUserTeams(organizationId);

    return (
        <StatisticBlock
            title="Your Teams"
            description="Teams with assigned tasks"
            button={{title: "Show all", link: "/workspace/teams"}}
        >
            {userTeamList ? (
                userTeamList.length > 0 ? (
                    userTeamList?.map((team, i) => (
                        <StatisticItem
                            key={i}
                            icon={<UsersThree size={32}/>}
                            title={team.title}
                            description={team.description}
                            subtitle={`Tasks: ${team._count?.tasks}`}
                            link={{href: team.id, text: "Look -->"}}
                        />
                    ))
                ) : (
                    <NotFoundElement/>
                )
            ) : (
                <NotFoundElement/>
            )}
        </StatisticBlock>
    );
}
