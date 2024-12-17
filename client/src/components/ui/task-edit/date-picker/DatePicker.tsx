import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import cn from "clsx";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { MultiplicationSignIcon } from "hugeicons-react";
import { useOutside } from "@/hooks/useOutside";
import "./DatePicker.css";

dayjs.extend(LocalizedFormat);

interface DatePickerProps {
	onChange: (value: string) => void;
	value: string | Date;
	position?: "left" | "right";
	dateFormat?: string; // Optional date format prop
}

export function DatePicker({
	onChange,
	value,
	dateFormat = "LL",
}: DatePickerProps) {
	const [selected, setSelected] = useState<Date | undefined>(
		value ? new Date(value) : undefined
	);
	const { isShow, setIsShow, ref } = useOutside(false);

	const handleDaySelect = (date: Date | undefined) => {
		setSelected(date);
		if (date) {
			onChange(date.toISOString());
			setIsShow(false);
		} else {
			onChange("");
		}
	};

	return (
		<div className="relative flex justify-between items-center" ref={ref}>
			<button
				onClick={() => setIsShow(!isShow)}
				aria-label="Toggle date picker"
			>
				{selected ? dayjs(selected).format(dateFormat) : "Click to select"}
			</button>
			{selected && (
				<button
					className="relative opacity-50 hover:opacity-100 transition-opacity"
					onClick={() => {
						setSelected(undefined);
						onChange("");
					}}
					aria-label="Clear selected date"
				>
					<MultiplicationSignIcon size={14} />
				</button>
			)}
			{isShow && (
				<div
					className={cn(
						"absolute p-2.5 slide z-10 shadow bg-blockColor border border-borderColor"
					)}
					style={{ top: "calc(100% + .7rem)" }}
				>
					<DayPicker
						mode="single"
						selected={selected}
						onSelect={handleDaySelect}
						weekStartsOn={1}
						footer={
							selected
								? `Selected: ${selected.toLocaleDateString()}`
								: "Pick a day."
						}
						startMonth={new Date(2020, 6)}
						endMonth={new Date(2999, 12)}
						captionLayout="dropdown" // Caption dropdown for months and years
					/>
				</div>
			)}
		</div>
	);
}
