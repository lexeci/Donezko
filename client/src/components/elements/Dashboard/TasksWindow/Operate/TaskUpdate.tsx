import styles from "@/components/elements/Dashboard/TasksWindow/Operate/TaskOperate.module.scss";
import { Button, Field, Select } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchTeamsByProject } from "@/hooks/team/useFetchTeamsByProject";
import { useFetchUsersTeam } from "@/hooks/team/useFetchUsersTeam";
import { useUpdateTask } from "@/src/hooks/tasks/useUpdateTask";
import {
	EnumTaskPriority,
	EnumTaskStatus,
	TaskFormData,
	TaskResponse,
} from "@/types/task.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TaskCreate {
	updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	taskId?: string;
	projectId?: string;
	data?: TaskResponse;
	switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>;
	handleRefetch: () => void;
}

export default function TaskUpdate({
	updateTaskList,
	taskId,
	projectId,
	data: localData,
	switchType,
	handleRefetch,
}: TaskCreate) {
	const [teamsSelected, setTeamSelected] = useState<string>();

	const { organizationId } = useOrganization();

	const { teamList } = useFetchTeamsByProject(organizationId, projectId);
	const { teamUsers, handleRefetch: refetchTeamUsers } = useFetchUsersTeam({
		organizationId,
		id: teamsSelected,
	});

	const priority = Object.values(EnumTaskPriority);
	const status = Object.values(EnumTaskStatus);

	const { modifyTask } = useUpdateTask();
	const { register, handleSubmit, setValue, reset } = useForm<TaskFormData>({
		mode: "onChange",
	});

	useEffect(() => {
		if (localData) {
			setValue("title", localData.title);
			setValue("description", localData.description);

			setValue("teamId", localData.teamId);
			setTeamSelected(localData.teamId);

			setValue("userId", localData.userId);

			// @ts-ignore
			setValue("taskStatus", localData.taskStatus);
			// @ts-ignore
			setValue("priority", localData.priority);
		}
	}, []);

	const handleUpdateCard = (data?: TaskResponse) => {
		if (data) {
			updateTaskList(previousTasks => {
				return previousTasks
					? previousTasks.filter(item => (item.id === data.id ? data : item))
					: previousTasks;
			});
		}
	};

	// Хендлер для вибору організації
	const handleTeamSelect = (value: string) => {
		setValue("teamId", value); // Встановлюємо це значення в форму
		setTeamSelected(value);
	};

	// Хендлер для вибору організації
	const handlePrioritySelect = (value: EnumTaskPriority) => {
		// @ts-ignore
		setValue("priority", value); // Встановлюємо це значення в форму
	};

	// Хендлер для вибору організації
	const handleStatusSelect = (value: EnumTaskStatus) => {
		// @ts-ignore
		setValue("taskStatus", value); // Встановлюємо це значення в форму
	};

	useEffect(() => {
		teamsSelected && refetchTeamUsers();
	}, [teamsSelected]);

	const handleUserSelect = (value: string) => {
		setValue("userId", value); // Встановлюємо це значення в форму
	};

	const onSubmit: SubmitHandler<TaskFormData> = data => {
		if (taskId) {
			organizationId &&
				modifyTask(
					{ taskId, organizationId, data },
					{
						onSuccess(data) {
							data && handleUpdateCard(data);
							data && handleRefetch();
							reset(data);
						},
					}
				);
		}
	};

	return (
		<div className={styles["task-operate-window"]}>
			<div className={styles["task-operate-window__actions"]}>
				<p onClick={() => switchType && switchType("operate")}>
					Return to info
				</p>
			</div>
			<div className={styles.info}>
				<div className={styles.title}>
					<h4>Updating a task</h4>
				</div>
				<div className={styles["text-block"]}>
					<p>This window allow you to update a task.</p>
				</div>
			</div>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<Field
					extra={styles["form__fields"]}
					id="title"
					label="Title:"
					placeholder="Enter title:"
					type="text"
					{...register("title", {
						required: "Title is required!",
					})}
				/>
				<Field
					extra={styles["form__fields"]}
					id="description"
					label="Description:"
					placeholder="Enter description"
					type="text"
					{...register("description", {
						maxLength: { value: 500, message: "Description is too long" }, // Валідація на довжину
					})}
				/>
				<Select
					id="status-select"
					placeholder="Choose status (Optional)"
					label="Select a status"
					options={status.map(item => ({
						value: item,
						label: item,
					}))}
					onChange={data =>
						handleStatusSelect(data.target.value as EnumTaskStatus)
					}
					extra={styles["form__fields"]}
				/>
				<Select
					id="priority-select"
					placeholder="Choose priority (Optional)"
					label="Select a priority"
					options={priority.map(item => ({
						value: item,
						label: item,
					}))}
					onChange={data =>
						handlePrioritySelect(data.target.value as EnumTaskPriority)
					}
					extra={styles["form__fields"]}
				/>
				{teamList && (
					<Select
						id="team-select"
						placeholder="Select team"
						label="Select a team"
						options={teamList.inProject.map(item => ({
							value: item.id,
							label: item.title,
						}))}
						onChange={data => handleTeamSelect(data.target.value)}
						extra={styles["form__fields"]}
					/>
				)}
				{teamsSelected && teamUsers && (
					<Select
						id="team-user-select"
						label="Assign a performer"
						placeholder="Assign user to task (optional)"
						options={teamUsers.map(item => ({
							value: item.user.id,
							label: item.user.name,
						}))}
						onChange={data => handleUserSelect(data.target.value)}
						extra={styles["form__fields"]}
					/>
				)}
				<div className={styles.actions}>
					<Button type="button" block>
						Update Task
					</Button>
				</div>
			</form>
		</div>
	);
}
