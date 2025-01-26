"use client";

import pageStyles from "@/app/page.module.scss";
import {
	Button,
	EntityItem,
	LackPermission,
	ModalWindow,
	NotFoundId,
	PageHeader,
	PageLayout,
	TeamUpdate,
	TeamUsers,
	WindowContainer,
} from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useDeleteTeam } from "@/hooks/team/useDeleteTeam";
import { useFetchTeamById } from "@/hooks/team/useFetchTeamById";
import { useFetchTeamRole } from "@/hooks/team/useFetchTeamRole";
import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole } from "@/types/org.types";
import { TeamRole } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Browsers } from "@phosphor-icons/react";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Team() {
	const { replace } = useRouter();
	const { organizationId } = useOrganization();
	const { profileData } = useFetchUserProfile();

	const [isMember, setIsMember] = useState<boolean>(false);
	const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<boolean>(false);

	const params = useParams<{ id: string }>();
	const { id: teamId } = params;

	const { team: fetchedData, setTeam } = useFetchTeamById(
		teamId,
		organizationId
	);
	const { organizationRole } = useFetchOrgRole(organizationId);
	const { teamRole } = useFetchTeamRole(teamId, organizationId);

	// const role = fetchedData?.role;
	const projectsArray = fetchedData?.projectTeams;

	const { deleteTeam } = useDeleteTeam();

	const hasPermission =
		teamRole?.role === TeamRole.LEADER ||
		organizationRole?.role === OrgRole.OWNER ||
		organizationRole?.role === OrgRole.ADMIN;

	useEffect(() => {
		if (fetchedData) {
			const usersArray = fetchedData.teamUsers;
			if (usersArray && profileData) {
				const member = usersArray.filter(
					user => user.userid === profileData.user.id && user
				);

				if (isMember && !hasPermission) {
					setIsMember(true);
				} else if (teamRole?.role === TeamRole.MEMBER) {
					setIsMember(true);
				} else if (hasPermission) {
					setIsMember(true);
				}
			}
		}
	}, [fetchedData, profileData]);

	return fetchedData ? (
		isMember ? (
			<PageLayout>
				<PageHeader
					pageTitle="Team"
					title={fetchedData?.title as string}
					desc={fetchedData?.description as string}
					extraDesc={
						fetchedData &&
						`Participants: ${fetchedData?._count?.teamUsers} | Tasks: ${fetchedData?._count?.tasks}`
					}
					extraInfo={
						fetchedData.organization &&
						`Organization: ${fetchedData.organization.title}`
					}
					button={hasPermission && "Update Team"}
					buttonAction={() => hasPermission && setOpenModalUpdate(true)}
				/>
				<div className={pageStyles["workspace-content-col"]}>
					<WindowContainer
						title={fetchedData.title}
						subtitle={`Projects [${projectsArray ? projectsArray?.length : 0}]`}
						autoContent
					>
						{projectsArray ? (
							projectsArray?.length > 0 ? (
								projectsArray.map((item, i) => {
									const { project } = item;
									const { _count } = project;
									return (
										<EntityItem
											icon={<Browsers size={84} />}
											linkBase={`${DASHBOARD_PAGES.PROJECTS}/${project.id}`}
											title={project.title}
											firstStat={`Participants: ${_count?.projectUsers}`}
											secondaryStat={`Tasks: ${_count?.tasks}`}
											key={generateKeyComp(`${project.title}__${i}`)}
										/>
									);
								})
							) : (
								<div className={pageStyles["workspace-not-found"]}>
									<h5>There is no project for you</h5>
								</div>
							)
						) : (
							<div className={pageStyles["workspace-not-found"]}>
								<h5>There is no project for you</h5>
							</div>
						)}
					</WindowContainer>
					<WindowContainer
						title={fetchedData.title}
						subtitle={"Participants"}
						fullPage
					>
						<TeamUsers
							teamId={fetchedData.id}
							orgRole={organizationRole?.role}
							role={teamRole?.role}
						/>
					</WindowContainer>
					{hasPermission && organizationId && (
						<Button type="button" onClick={() => setOpenModal(true)}>
							<Trash size={22} className="mr-4" />
							Delete Team
						</Button>
					)}
				</div>
				{openModal && organizationId && (
					<ModalWindow
						title="Program to ask of sure action.exe"
						subtitle="Hey do you really know what you are doing ?"
						onClose={() => setOpenModal(false)}
					>
						<div className={pageStyles["workspace-modal-container"]}>
							<div className={pageStyles["workspace-modal-container__desc"]}>
								<h1>Hey did you know?</h1>
								<p>
									If you proceed on this action you will delete this team which
									are related to project or tasks. Make sure that you understand
									that.
								</p>
							</div>
							<div
								className={
									pageStyles["workspace-modal-container__btn-container"]
								}
							>
								<Button
									type="button"
									onClick={() =>
										deleteTeam(
											{ teamId, organizationId },
											{
												onSuccess: () => replace(DASHBOARD_PAGES.TEAMS),
											}
										)
									}
								>
									<Trash
										size={22}
										className={pageStyles["workspace-modal-container__ico"]}
									/>{" "}
									Delete
								</Button>
							</div>
						</div>
					</ModalWindow>
				)}
				{openModalUpdate && (
					<ModalWindow
						title="Update Project.exe"
						subtitle="It's time to update :()"
						onClose={() => setOpenModalUpdate(false)}
					>
						{fetchedData && organizationId && (
							<div className={pageStyles["workspace-modal-container"]}>
								<TeamUpdate
									id={teamId}
									data={fetchedData}
									pullCloseModal={setOpenModalUpdate}
									pullUpdatedData={setTeam}
								/>
							</div>
						)}
					</ModalWindow>
				)}
			</PageLayout>
		) : (
			<LackPermission />
		)
	) : (
		<NotFoundId elementTitle="Team" />
	);
}
