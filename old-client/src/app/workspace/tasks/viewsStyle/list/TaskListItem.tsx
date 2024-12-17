import cn from "clsx";
import {
	DragDropVerticalIcon,
	Loading02Icon,
	WasteIcon,
} from "hugeicons-react";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";

import Checkbox from "@/components/ui/checkbox";
import { TransparentField } from "@/components/ui/fields/TransparentField";
import { SingleSelect } from "@/components/ui/task-edit/SingleSelect";
import { DatePicker } from "@/components/ui/task-edit/date-picker/DatePicker";

import type { TaskFormData, TaskResponse } from "@/types/task.types";

import { useDebouncedTaskHandler } from "@/hooks/tasks/useDebouncedTaskHandler";
import { useTaskRemoval } from "@/hooks/tasks/useTaskRemoval";

import styles from "./TaskListView.module.scss";

interface TaskListItem {
	// Зміна назви інтерфейсу
	item: TaskResponse;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса
}

export function TaskListItem({ item, updateTasks }: TaskListItem) {
	// Зміна назви функції
	const { register, control, watch } = useForm<TaskFormData>({
		defaultValues: {
			title: item.title,
			isCompleted: item.isCompleted,
			createdAt: item.createdAt,
			priority: item.priority,
		},
	});

	useDebouncedTaskHandler({ watch, taskId: item.id });

	const { removeTask, isRemovalPending } = useTaskRemoval();

	return (
		<div
			className={cn(
				styles.row,
				watch("isCompleted") ? styles.completed : "",
				"animation-opacity"
			)}
		>
			<div>
				<span className="inline-flex items-center gap-2.5 w-full">
					<button aria-describedby="todo-item">
						<DragDropVerticalIcon className={styles.grip} />
					</button>

					<Controller
						control={control}
						name="isCompleted"
						render={({ field: { value, onChange } }) => (
							<Checkbox onChange={onChange} checked={value} />
						)}
					/>

					<TransparentField {...register("title")} />
				</span>
			</div>
			<div>
				<Controller
					control={control}
					name="createdAt"
					render={({ field: { value, onChange } }) => (
						<DatePicker onChange={onChange} value={value || ""} />
					)}
				/>
			</div>
			<div className="capitalize">
				<Controller
					control={control}
					name="priority"
					render={({ field: { value, onChange } }) => (
						<SingleSelect
							data={["high", "medium", "low"].map(item => ({
								value: item,
								label: item,
							}))}
							onChange={onChange}
							value={value || ""}
						/>
					)}
				/>
			</div>
			<div>
				<button
					onClick={
						() =>
							item.id
								? removeTask(item.id)
								: updateTasks(prev => prev?.slice(0, -1)) // Зміна назви пропса
					}
					className="opacity-50 transition-opacity hover:opacity-100"
				>
					{isRemovalPending ? (
						<Loading02Icon size={15} />
					) : (
						<WasteIcon size={15} />
					)}
				</button>
			</div>
		</div>
	);
}
