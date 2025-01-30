import { Dispatch, SetStateAction, useState } from "react";

import { AsciiElement } from "@/src/components/ui";
import type { TaskResponse } from "@/types/task.types";
import { formatTimestampToAmPm } from "@/utils/timeFormatter";

import TaskOperate from "@/components/elements/Dashboard/TasksWindow/TaskOperate";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useFetchProjectRole } from "@/hooks/project/useFetchProjectRole";
import { useFetchTeamRole } from "@/hooks/team/useFetchTeamRole";
import { OrgRole } from "@/types/org.types";
import { ProjectRole } from "@/types/project.types";
import toCapitalizeText from "@/utils/toCapitalizeText";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";

import clsx from "clsx";
import styles from "./ListRowView.module.scss";

interface IListRow {
	projectId: string;
	data: TaskResponse;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса для унікальності
	setDisableDnD: Dispatch<SetStateAction<boolean>>;
	handleRefetch: () => void;
}

export default function ListRowCard({
	data,
	updateTasks,
	projectId,
	setDisableDnD,
	handleRefetch,
}: IListRow) {
	const [DndDisabled, setDndDisabled] = useState<boolean>(false);
	const [showCardInfo, setShowCardInfo] = useState<boolean>(false);
	const [windowType, setWindowType] = useState<"create" | "operate" | "edit">(
		"operate"
	);

	const { organizationId } = useOrganization();
	const { organizationRole } = useFetchOrgRole(organizationId);
	const { projectRole } = useFetchProjectRole(data?.projectId, organizationId);
	const { teamRole } = useFetchTeamRole(data?.teamId, organizationId);

	const hasAccess = teamRole
		? true
		: organizationRole?.role === OrgRole.ADMIN ||
		  organizationRole?.role === OrgRole.OWNER ||
		  projectRole === ProjectRole.MANAGER;

	const showModalWindow = () => {
		setShowCardInfo(!showCardInfo);
		setDndDisabled(!DndDisabled);
		setDisableDnD(!DndDisabled);
	};

	const time = data?.updatedAt
		? formatTimestampToAmPm(data.updatedAt)
		: undefined;
	const returnStatus = () => {
		switch (data?.taskStatus) {
			case "NOT_STARTED":
				return <AsciiElement types="notStarted" />;
			case "IN_PROGRESS":
				return <AsciiElement types="progress" />;
			case "COMPLETED":
				return <AsciiElement types="completed" />;
			case "ON_HOLD":
				return <AsciiElement types="hold" />;

			default:
				return <AsciiElement types="loading" />;
		}
	};

	return (
		data && (
			<>
				<div
					className={clsx(
						styles.row,
						data.taskStatus ? styles.completed : "",
						"animation-opacity"
					)}
					onClick={() => hasAccess && showModalWindow()}
				>
					<div>
						<button aria-describedby="todo-item">
							<DotsSixVertical size={21} className={styles.grip} />
						</button>

						<div className="flex">
							<h3>
								<b>
									<span>Task:</span>
								</b>
								{data.title}
							</h3>
						</div>
					</div>
					<div className={styles.author}>
						<p>
							<b>Author</b>:
							<br />
							{data.author?.name}
						</p>
					</div>
					<div className={styles.priority}>
						<p>
							<b>Priority:</b> {toCapitalizeText(data.priority as string)}
						</p>
					</div>
					<div className={styles.status}>{returnStatus()}</div>
					<div className={styles.time}>
						{formatTimestampToAmPm(data.updatedAt as Date)}
					</div>
				</div>
				{showCardInfo && (
					<TaskOperate
						type={windowType}
						switchType={setWindowType}
						updateTaskList={updateTasks}
						taskId={data.id}
						projectId={projectId}
						data={data}
						onClose={showModalWindow}
						handleRefetch={handleRefetch}
					/>
				)}
			</>
		)
	);
}
