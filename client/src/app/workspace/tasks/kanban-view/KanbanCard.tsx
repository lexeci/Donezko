import cn from "clsx";
import { DragDropVerticalIcon, Loading02Icon, WasteIcon } from "hugeicons-react";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";

import Checkbox from "@/components/ui/checkbox";
import { TransparentField } from "@/components/ui/fields/TransparentField";
import { SingleSelect } from "@/components/ui/task-edit/SingleSelect";
import { DatePicker } from "@/components/ui/task-edit/date-picker/DatePicker";

import type { TaskResponse, TypeTaskFormState } from "@/types/task.types";

import { useDeleteTask } from "../hooks/useDeleteTask";
import { useTaskDebounce } from "../hooks/useTaskDebounce";

import styles from "./KanbanView.module.scss";

interface KanbanCard {
	item: TaskResponse;
	setItems: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
}

export function KanbanCard({ item, setItems }: KanbanCard) {
	const { register, control, watch } = useForm<TypeTaskFormState>({
		defaultValues: {
			title: item.title,
			isCompleted: item.isCompleted,
			createdAt: item.createdAt,
			priority: item.priority,
		},
	});

	useTaskDebounce({ watch, itemId: item.id });

	const { deleteTask, isDeletePending } = useDeleteTask();

	return (
		<div
			className={cn(
				styles.card,
				{
					[styles.completed]: watch("isCompleted"),
				},
				"animation-opacity"
			)}
		>
			<div className={styles.cardHeader}>
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
			</div>

			<div className={styles.cardBody}>
				<Controller
					control={control}
					name="createdAt"
					render={({ field: { value, onChange } }) => (
						<DatePicker
							onChange={onChange}
							value={value || ""}
							position="left"
						/>
					)}
				/>

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

			<div className={styles.cardActions}>
				<button
					onClick={() =>
						item.id ? deleteTask(item.id) : setItems(prev => prev?.slice(0, -1))
					}
					className="opacity-50 transition-opacity hover:opacity-100"
				>
					{isDeletePending ? <Loading02Icon size={15} /> : <WasteIcon size={15} />}
				</button>
			</div>
		</div>
	);
}
