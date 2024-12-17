import pageStyles from "@/app/page.module.scss";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import {
	Button,
	EntityItem,
	PageHeader,
	PageLayout,
	TasksWindow,
	WindowContainer,
} from "@/src/components";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Person, Trash, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Project`,
	...NO_INDEX_PAGE,
};

export default function Project() {
	const teamArray = [
		{
			title: "Insomnia Team",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Team",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Team",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Project",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
	];

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Project"
				title="Insomnia Project"
				desc={`Participants: 32 | Teams: 16 | Projects: 15 | Tasks: 32`}
			/>
			<div className={pageStyles["workspace-content-col"]}>
				<TasksWindow />
				<WindowContainer title="Insomnia Project" subtitle="Teams [15]">
					{teamArray.map((item, i) => (
						<EntityItem
							icon={<UsersThree size={84} />}
							linkBase={`/workspace/teams/${item.id}`}
							title={item.title}
							firstStat={`Participants: ${item.participants}`}
							secondaryStat={`Tasks: ${item.tasks}`}
							key={generateKeyComp(`${item.title}__${i}`)}
						/>
					))}
				</WindowContainer>
				<WindowContainer
					title="Insomnia Project"
					subtitle="Users [15]"
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
											Projects: {"["}"Insomnia Project", "Skoda Activision
											Blizzard"{"]"}
										</p>
									</div>
									<div className="teams">
										<p>
											Teams: {"["}"Insomnia Project", "Skoda Activision
											Blizzard"
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
											Projects: {"["}"Insomnia Project", "Skoda Activision
											Blizzard"{"]"}
										</p>
									</div>
									<div className="teams">
										<p>
											Teams: {"["}"Insomnia Project", "Skoda Activision
											Blizzard"
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
											Projects: {"["}"Insomnia Project", "Skoda Activision
											Blizzard"{"]"}
										</p>
									</div>
									<div className="teams">
										<p>
											Teams: {"["}"Insomnia Project", "Skoda Activision
											Blizzard"
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
					<Trash size={22} className="mr-4" /> Delete project
				</Button>
			</div>
		</PageLayout>
	);
}
