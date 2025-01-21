import {Button} from "@/components/ui";
import {useFetchOrgUsers} from "@/hooks/organization/useFetchOrgUsers";
import {useAddTeamUser} from "@/hooks/team/useAddTeamUser";
import {useOrganization} from "@/context/OrganizationContext";
import generateKeyComp from "@/utils/generateKeyComp";
import {OrgUserResponse} from "@/types/org.types";
import {Person} from "@phosphor-icons/react";
import {useEffect, useState} from "react";
import ModalWindow from "../../ModalWindow/ModalWindow";

import styles from "./OperateElements.module.scss"
import pageStyles from "@/app/page.module.scss";

interface AddUserToTeams {
    teamId: string;
    setOpenModalUpdate: (arg: boolean) => void;
    refetch: () => void;
}

export default function AddUserToTeams(
    {
        teamId,
        setOpenModalUpdate,
        refetch,
    }: AddUserToTeams) {
    const [organizationUsers, setOrganizationUsers] = useState<
        OrgUserResponse[] | undefined
    >();
    const {organizationId} = useOrganization();
    const {organizationUserList} = useFetchOrgUsers({
        organizationId,
        teamId,
        hideFromTeam: true,
    });

    useEffect(() => {
        setOrganizationUsers(organizationUserList);
    }, [organizationUserList]);

    const {addUserToTeam} = useAddTeamUser();

    const handleAddUser = (teamUserId: string) => {
        if (organizationId)
            addUserToTeam(
                {
                    id: teamId,
                    teamUserId,
                    organizationId,
                },
                {
                    onSuccess: data => {
                        setOrganizationUsers(
                            prevState =>
                                prevState &&
                                prevState.filter(user => user.userId !== data.userId && user)
                        );
                        refetch();
                    },
                }
            );
    };

    return (
        <ModalWindow
            title="Add user to team.exe"
            subtitle="Add new participant to your team"
            onClose={() => setOpenModalUpdate(false)}
        >
            <div
                className={styles["add-user"]}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h4>Add more users to your team</h4>
                    </div>
                    <div className={styles["text-block"]}>
                        <p>
                            You can add more users to your team by using the list from
                            organization participants
                        </p>
                    </div>
                </div>
                <div className={styles.container}>
                    <div
                        className={styles.users}>
                        {organizationUsers ? (
                            organizationUsers.length > 0 ? (
                                organizationUsers.map((userItem, i) => (
                                    <div
                                        className={pageStyles["workspace-user-list__users__item"]}
                                        key={generateKeyComp(`${userItem.user.name}__${i}`)}
                                    >
                                        <Person size={48}
                                                className={pageStyles["workspace-user-list__users__item__ico"]}/>
                                        <div className={pageStyles["workspace-user-list__users__item__about"]}>
                                            <div className={pageStyles["workspace-user-list__users__item__name"]}>
                                                <p>Username: {userItem.user.name}</p>
                                            </div>
                                        </div>
                                        <div className={pageStyles["workspace-user-list__users__item__actions"]}>
                                            <Button
                                                type="button"
                                                modal
                                                fullWidth
                                                onClick={() => handleAddUser(userItem.userId)}
                                            >
                                                Add user
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    className={pageStyles["workspace-user-list__not-found"]}>
                                    <h5>
                                        You don't have any participants in current organization
                                    </h5>
                                </div>
                            )
                        ) : (
                            <div
                                className={pageStyles["workspace-user-list__not-found"]}>
                                <h5>You don't have any participants in current organization</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModalWindow>
    );
}
