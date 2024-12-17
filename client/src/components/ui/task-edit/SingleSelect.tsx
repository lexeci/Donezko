import cn from "clsx";
import { MultiplicationSignIcon } from "hugeicons-react";

import { Badge } from "@/components/ui/Badge";
import { useOutside } from "@/hooks/useOutside";
import { BadgeVariants } from "@/constants/badge.constants";

export interface Option {
	label: string;
	value: string;
}

interface SingleSelect {
	data: Option[];
	onChange: (value: string) => void;
	value: string;
	isColorSelect?: boolean;
}

export function SingleSelect({
	data,
	onChange,
	value,
	isColorSelect,
}: SingleSelect) {
	const { isShow, setIsShow, ref } = useOutside(false);
	const selectedValue = data.find(item => item.value === value);

	return (
		<div
			className={cn(
				"relative flex flex-row justify-between items-center min-w-36",
				{
					"w-max": isColorSelect,
				}
			)}
			ref={ref}
		>
			<button
				onClick={e => {
					e.preventDefault();
					setIsShow(!isShow);
				}}
				aria-haspopup="true"
				aria-expanded={isShow}
				className="focus:outline-none" // Remove focus outline in favor of custom styling
			>
				{selectedValue ? (
					<Badge
						variant={value}
						className="capitalize"
						style={isColorSelect ? { backgroundColor: value } : {}}
					>
						{selectedValue.label}
					</Badge>
				) : (
					<Badge>Click to select</Badge>
				)}
			</button>
			{value && (
				<button
					className="relative block opacity-30 hover:opacity-100 transition-opacity"
					onClick={e => {
						e.preventDefault();
						onChange(BadgeVariants.DEFAULT);
					}}
					aria-label="Clear selection"
				>
					<MultiplicationSignIcon size={14} />
				</button>
			)}
			{isShow && (
				<div
					className={cn(
						"absolute w-auto p-2.5 left-0 slide bg-blockColor border border-borderColor z-10 shadow "
					)}
					style={{
						top: "calc(100% + .5rem)",
					}}
					role="menu"
				>
					{data.map(item => (
						<button
							key={item.value}
							onClick={e => {
								e.preventDefault();
								onChange(item.value);
								setIsShow(false);
							}}
							className="block mb-4 last:mb-0 capitalize rounded-lg"
							style={
								isColorSelect
									? {
											backgroundColor: item.value,
									  }
									: {}
							}
							role="menuitem" // Define role for accessibility
						>
							<Badge variant={item.value}>{item.label}</Badge>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
