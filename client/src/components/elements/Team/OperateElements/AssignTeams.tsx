import { Button } from "@/components/index";
import { TeamsResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { UserList } from "@phosphor-icons/react/dist/ssr";

export function AssignTeams({
	projectId,
	projectTitle,
	organizationId,
	unAssignedTeams,
	handleAssign,
}: {
	projectId: string | null;
	projectTitle?: string;
	organizationId: string | null;
	unAssignedTeams: TeamsResponse[];
	handleAssign: (teamId: string) => void;
}) {
	return (
		<div className="tab">
			<div className="short-info border-b border-foreground pb-2 mb-0.5">
				<div className="title text-lg font-bold">
					<h5>
						Link a team to your project {projectTitle ? projectTitle : ""}
					</h5>
				</div>
				<div className="text-block">
					<p>
						These are the available teams that can be assigned to your project.
					</p>
				</div>
			</div>
			<div className="operate-window border-t border-foreground pt-4 flex flex-col justify-center items-center gap-y-2">
				{unAssignedTeams && unAssignedTeams.length > 0 ? (
					unAssignedTeams.map((item, i) => {
						return (
							<div
								className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground"
								key={generateKeyComp(`${item.title}__${i}`)}
							>
								<UserList
									size={48}
									className="border border-foreground p-0.5"
								/>
								<div className="about flex flex-col justify-start items-start">
									<div className="name">
										<p>Title: {item.title}</p>
									</div>
									<div className="email">
										<p>Description: "{item.description}"</p>
									</div>
									<div className="participant">
										<p>Participants: "{item._count?.teamUsers}"</p>
									</div>
								</div>
								<div className="actions flex flex-col gap-y-2 ml-auto">
									<Button
										type="button"
										block
										negative
										onClick={() => handleAssign(item.id)}
									>
										Assign
									</Button>
								</div>
							</div>
						);
					})
				) : (
					<div className="item flex flex-row justify-between items-center w-full gap-x-4 p-2 border border-foreground bg-hoverFill">
						<h5>No available teams in the current organization</h5>
					</div>
				)}
			</div>
		</div>
	);
}
