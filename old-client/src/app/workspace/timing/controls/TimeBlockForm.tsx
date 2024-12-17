import { Controller, SubmitHandler, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/buttons/Button"; // Renamed Button
import { Field } from "@/components/ui/fields/Field"; // Renamed Field
import { SingleSelect } from "@/components/ui/task-edit/SingleSelect"; // Renamed SingleSelect

import type { TimeBlockFormValues } from "@/types/time-block.types"; // Renamed TimeBlockFormValues

import { COLORS } from "@/constants/colors.constants"; // Renamed COLORS
import { useCreateBlock } from "./useCreateBlock"; // Renamed useCreateTimeBlock
import { useUpdateBlock } from "./useUpdateBlock"; // Renamed useUpdateTimeBlock

export function TimeBlockForm() {
	const { register, control, watch, reset, handleSubmit } =
		useFormContext<TimeBlockFormValues>(); // Updated Type

	const existingId = watch("id"); // Renamed existsId

	const { updateBlock } = useUpdateBlock(existingId); // Renamed updateTimeBlock
	const { createBlock, isPending } = useCreateBlock(); // Renamed createBlock

	const onSubmit: SubmitHandler<TimeBlockFormValues> = formData => {
		const { color, id, ...rest } = formData;
		const payload = { ...rest, color: color || undefined }; // Renamed dto

		if (id) {
			updateBlock({ id, data: payload });
		} else {
			createBlock(payload);
		}

		reset({
			color: COLORS[COLORS.length - 1], // Renamed COLORS
			duration: 0,
			title: "",
			id: undefined,
			order: 1,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-3/5">
			<Field
				{...register("title", { required: true })}
				id="task-name" // Renamed id
				label="Task Name:" // Updated label
				placeholder="Enter task name..." // Updated placeholder
				extra="mb-4"
			/>

			<Field
				{...register("duration", { required: true, valueAsNumber: true })}
				id="task-duration" // Renamed id
				label="Duration (minutes):" // Updated label
				placeholder="Enter duration (in minutes)..." // Updated placeholder
				isNumber
				extra="mb-4"
			/>

			<div>
				<span className="inline-block mb-1.5">Select Color:</span>
				{/* Updated text */}
				<Controller
					control={control}
					name="color"
					render={({ field: { value, onChange } }) => (
						<SingleSelect
							data={COLORS.map(item => ({ value: item, label: item }))} // Renamed COLORS
							onChange={onChange}
							value={value || COLORS[COLORS.length - 1]} // Renamed COLORS
							isColorSelect
						/>
					)}
				/>
			</div>

			<Button type="submit" disabled={isPending} className="mt-6">
				{/* Renamed Button */}
				{existingId ? "Update" : "Create"}
			</Button>
		</form>
	);
}
