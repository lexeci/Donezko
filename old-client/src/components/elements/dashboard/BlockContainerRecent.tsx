import { TaskFormData } from "@/types/task.types";
import generateKeyComp from "@/utils/generateKeyComp";

interface BlockContainerRecentProps {
	data: TaskFormData[];
}

// TODO: Fix the 'as string' part of code

export default function BlockContainerRecent({
	data,
}: BlockContainerRecentProps) {
	return (
		<div className="block-container flex flex-col gap-3 p-3 border border-borderColor h-auto w-auto max-h-[306px] overflow-y-auto">
			<div className="title pb-2 border-b border-b-borderColor">
				<h3>Recent tasks:</h3>
			</div>
			{data.length > 0 ? (
				data.map(item => (
					<div
						className="block-container group flex flex-col items-center gap-2 p-3 border border-borderColor h-auto hover:bg-foreground hover:text-background hover:border-foreground transition-all ease-in-out duration-200 w-auto cursor-pointer"
						key={generateKeyComp(item.title as string)} // Assuming item has a unique id
					>
						<div className="title w-full text-left text-sm flex justify-between items-center">
							<h4>Task: {item.title}</h4>
							<span
								className={`block dot h-2 w-2 rounded-full bg-${item.priority}`}
							/>
						</div>
						<div className="description font-mono text-xs text-left w-full bg-foreground-300 border border-borderColor px-1 group-hover:text-foreground">
							<p>{item.description}</p>
						</div>
					</div>
				))
			) : (
				<div className="text-center text-sm text-gray-500">
					<p>No recent tasks available.</p>
				</div>
			)}
		</div>
	);
}
