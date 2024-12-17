"use client";

import pageStyles from "@/app/page.module.scss";
import {
	Button,
	PageHeader,
	PageLayout,
	ProjectElements,
	TeamElements,
	WindowContainer,
} from "@/src/components";
import { useFetchOrgById } from "@/src/hooks/organization/useFetchOrgById";
import { Person, Trash } from "@phosphor-icons/react/dist/ssr";
import { useParams } from "next/navigation";

export default function Organization() {
	const params = useParams<{ id: string }>();
	const { id: organizationId } = params;

	const { organization: fetchedData } = useFetchOrgById(organizationId);

	const organization = fetchedData?.organization;
	const organizationStatus = fetchedData?.organizationStatus;
	const role = fetchedData?.role;

	console.log(organization);

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Organization"
				title={organization?.title as string}
				desc={`${organization?.description}\nParticipants: ${organization?._count?.organizationUsers} | Teams: ${organization?._count?.teams} | Projects: ${organization?._count?.projects}`}
			/>
			<div className={pageStyles["workspace-content-col"]}>
				<WindowContainer
					title={organization?.title as string}
					subtitle={`Projects: ${organization?._count?.projects}`}
					fullPage
				>
					{fetchedData?.organization.projects && (
						<ProjectElements
							isWindowElement
							organizationId={organizationId}
							projects={organization?.projects}
						/>
					)}
				</WindowContainer>
				<WindowContainer
					title={organization?.title as string}
					subtitle={`Teams: ${organization?._count?.teams}`}
					fullPage
				>
					{fetchedData?.organization.teams && (
						<TeamElements
							isWindowElement
							organizationId={organizationId}
							teams={organization?.teams}
						/>
					)}
				</WindowContainer>
				<WindowContainer
					title={organization?.title as string}
					subtitle={`Participants: ${organization?._count?.organizationUsers}`}
					fullPage
				>
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
				</WindowContainer>
				<Button type="button">
					<Trash size={22} className="mr-4" /> Delete organization
				</Button>
			</div>
		</PageLayout>
	);
}
