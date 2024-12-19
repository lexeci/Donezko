"use client";

import pageStyles from "@/app/page.module.scss";
import {
	Button,
	ModalWindow,
	NotFoundId,
	PageHeader,
	PageLayout,
	TeamUpdate,
} from "@/src/components";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchTeamById } from "@/src/hooks/team/useFetchTeamById";
import { useTeamRemoval } from "@/src/hooks/team/useTeamRemoval";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Team() {
	const { replace } = useRouter();
	const { organizationId } = useOrganization();
	const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<boolean>(false);

	const params = useParams<{ id: string }>();
	const { id: teamId } = params;

	const { team: fetchedData, setTeam } = useFetchTeamById(
		teamId,
		organizationId
	);

	const role = fetchedData?.role;
	const orgRole = fetchedData?.team.organization.organizationUsers?.[0].role;

	const { deleteTeam } = useTeamRemoval();

	const hasPermission =
		role === "LEADER" || orgRole === "OWNER" || orgRole === "ADMIN";

	console.log(fetchedData);

	return fetchedData ? (
		<PageLayout>
			<PageHeader
				pageTitle="Team"
				title={fetchedData.team?.title as string}
				desc={fetchedData.team?.description as string}
				extraDesc={
					fetchedData.team &&
					`Participants: ${fetchedData.team?._count?.teamUsers} | Tasks: ${fetchedData.team?._count?.tasks}`
				}
				extraInfo={
					fetchedData.team.organization &&
					`Organization: ${fetchedData.team.organization.title}`
				}
				button={hasPermission && "Update Team"}
				buttonAction={() => hasPermission && setOpenModalUpdate(true)}
			/>
			<div className={pageStyles["workspace-content-col"]}>
				{/* <WindowContainer title="Insomnia Works" subtitle="Projects [15]">
					{projectArray.map((item, i) => (
						<EntityItem
							icon={<Browsers size={84} />}
							linkBase={`/workspace/projects/${item.id}`}
							title={item.title}
							firstStat={`Teams: ${item.teams}`}
							secondaryStat={`Tasks: ${item.tasks}`}
							key={generateKeyComp(`${item.title}__${i}`)}
						/>
					))}
				</WindowContainer>
				<WindowContainer title="Insomnia Works" subtitle="Users [15]" fullPage>
					<div className="container flex flex-col w-full h-full bg-background border border-foreground p-4">
						<div className="title">
							<h5>Users in current organization:</h5>
						</div>
						<div className="users flex flex-col w-full h-full overflow-auto pt-4 gap-y-4">
							<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground">
								<Person size={48} className="border border-foreground p-0.5" />
								<div className="about flex flex-col justify-start items-start">
									<div className="name">
										<p>Username: "Andriy Neaijko"</p>
									</div>
									<div className="email">
										<p>Email: "andriy.neaijko@gmail.com"</p>
									</div>
									<div className="status">
										<p>Status: "Active"</p>
									</div>
									<div className="tasks">
										<p>Tasks: "4"</p>
									</div>
									<div className="projects">
										<p>
											Projects: {"["}"Insomnia Works", "Skoda Activision
											Blizzard"{"]"}
										</p>
									</div>
									<div className="teams">
										<p>
											Teams: {"["}"Insomnia Works", "Skoda Activision Blizzard"
											{"]"}
										</p>
									</div>
								</div>
								<div className="actions flex flex-col gap-y-2 ml-auto">
									<Button type="button" modal fullWidth>
										Ban
									</Button>
									<Button type="button" modal fullWidth>
										Make admin
									</Button>
									<Button type="button" modal fullWidth>
										Delete
									</Button>
								</div>
							</div>
							<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground">
								<Person size={48} className="border border-foreground p-0.5" />
								<div className="about flex flex-col justify-start items-start">
									<div className="name">
										<p>Username: "Andriy Neaijko"</p>
									</div>
									<div className="email">
										<p>Email: "andriy.neaijko@gmail.com"</p>
									</div>
									<div className="status">
										<p>Status: "Active"</p>
									</div>
									<div className="tasks">
										<p>Tasks: "4"</p>
									</div>
									<div className="projects">
										<p>
											Projects: {"["}"Insomnia Works", "Skoda Activision
											Blizzard"{"]"}
										</p>
									</div>
									<div className="teams">
										<p>
											Teams: {"["}"Insomnia Works", "Skoda Activision Blizzard"
											{"]"}
										</p>
									</div>
								</div>
								<div className="actions flex flex-col gap-y-2 ml-auto">
									<Button type="button" modal fullWidth>
										Ban
									</Button>
									<Button type="button" modal fullWidth>
										Make admin
									</Button>
									<Button type="button" modal fullWidth>
										Delete
									</Button>
								</div>
							</div>
							<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground">
								<Person size={48} className="border border-foreground p-0.5" />
								<div className="about flex flex-col justify-start items-start">
									<div className="name">
										<p>Username: "Andriy Neaijko"</p>
									</div>
									<div className="email">
										<p>Email: "andriy.neaijko@gmail.com"</p>
									</div>
									<div className="status">
										<p>Status: "Active"</p>
									</div>
									<div className="tasks">
										<p>Tasks: "4"</p>
									</div>
									<div className="projects">
										<p>
											Projects: {"["}"Insomnia Works", "Skoda Activision
											Blizzard"{"]"}
										</p>
									</div>
									<div className="teams">
										<p>
											Teams: {"["}"Insomnia Works", "Skoda Activision Blizzard"
											{"]"}
										</p>
									</div>
								</div>
								<div className="actions flex flex-col gap-y-2 ml-auto">
									<Button type="button" modal fullWidth>
										Ban
									</Button>
									<Button type="button" modal fullWidth>
										Make admin
									</Button>
									<Button type="button" modal fullWidth>
										Delete
									</Button>
								</div>
							</div>
						</div>
					</div>
				</WindowContainer> */}
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
					<div className="container bg-background flex flex-col justify-center items-center p-4 gap-y-8 w-auto h-auto">
						<div className="desc max-w-80 flex flex-col justify-center items-center text-center gap-y-2">
							<h1 className="font-bold text-lg">Hey did you know?</h1>
							<p>
								If you proceed on this action you will delete this team which
								are related to project or tasks. Make sure that you understand
								that.
							</p>
						</div>
						<div className="w-full h-full flex justify-center items-center">
							<Button
								type="button"
								onClick={() =>
									deleteTeam(
										{ teamId, organizationId },
										{
											onSuccess: () => replace("/workspace/teams"),
										}
									)
								}
							>
								<Trash size={22} className="mr-4" /> Delete
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
					{fetchedData.team && organizationId && (
						<div className="container bg-background flex flex-col justify-center items-center p-4 gap-y-8 w-auto h-auto">
							<TeamUpdate
								id={teamId}
								data={fetchedData.team}
								pullCloseModal={setOpenModalUpdate}
								pullUpdatedData={setTeam}
							/>
						</div>
					)}
				</ModalWindow>
			)}
		</PageLayout>
	) : (
		<NotFoundId elementTitle="Team" />
	);
}
