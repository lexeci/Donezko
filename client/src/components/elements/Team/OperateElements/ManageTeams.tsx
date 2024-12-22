import { Button } from "@/components/index";
import { TeamsResponse } from "@/src/types/team.types";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { UserList } from "@phosphor-icons/react/dist/ssr";

export function ManageTeams({
	projectTitle,
	assignedTeams,
	handleUnassign,
}: {
	projectTitle: string;
	assignedTeams: TeamsResponse[];
	handleUnassign: (teamId: string) => void;
}) {
	return (
		<div className="tab">
			<div className="short-info flex flex-col gap-y-1 pb-4 mb-0.5 border-b border-foreground">
				<div className="title text-lg font-bold">
					<h5>Manage teams to your project {projectTitle}</h5>
				</div>
				<div className="text-block">
					<p>There are teams assigned to your project that can be managed.</p>
				</div>
			</div>
			<div className="operate-window flex flex-col justify-center items-center gap-y-2 border-t border-foreground mt-0.5 pt-4">
				{assignedTeams && assignedTeams.length > 0 ? (
					assignedTeams.map((team, i) => {
						return (
							<div
								className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground"
								key={generateKeyComp(`${team.title}__${i}`)}
							>
								<UserList
									size={48}
									className="border border-foreground p-0.5"
								/>
								<div className="about flex flex-col justify-start items-start">
									<div className="name">
										<p>Title: {team.title}</p>
									</div>
									<div className="email">
										<p>Description: "{team.description}"</p>
									</div>
									<div className="participant">
										<p>Participants: "{team._count?.teamUsers}"</p>
									</div>
								</div>
								<div className="actions flex flex-col gap-y-2 ml-auto">
									<Button
										type="button"
										block
										negative
										onClick={() => handleUnassign(team.id)}
									>
										Unassign
									</Button>
								</div>
							</div>
						);
					})
				) : (
					<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
						<h5>No teams are assigned to the current project</h5>
					</div>
				)}
			</div>
		</div>
	);
}
