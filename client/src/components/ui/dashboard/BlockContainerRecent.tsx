import { TypeTaskFormState } from "@/types/task.types";
import generateKeyComp from "@/utils/generateKeyComp";

export default function BlockContainerRecent({
	data,
}: {
	data: TypeTaskFormState[];
}) {
	return (
		<div className="block-container flex flex-col gap-3 p-3 border border-borderColor h-auto w-auto max-h-[306px] overflow-y-scroll">
			<div className="title pb-2 border-b border-b-borderColor">
				<h3>Recent tasks:</h3>
			</div>
			{data?.map((item, i) => (
				<div
					className="block-container group flex flex-col items-center gap-2 p-3 border border-borderColor h-auto hover:bg-foreground hover:text-background hover:border-foreground transition-all ease-in-out duration-200 w-auto cursor-pointer"
					key={generateKeyComp(`${item.title}__${i}`)}
				>
					<div className="title w-full text-left text-sm flex justify-between items-center">
						<h4>Task: {item.title}</h4>
						{/* <span className={`dot h-1 w-1 rounded-full bg-${item.priority}`} /> */}
						<span className={`block dot h-2 w-2 rounded-full bg-red-500`} />
					</div>
					<div className="description font-mono text-xs text-left w-full bg-gray-300 border border-borderColor px-1 group-hover:text-foreground">
						<p>{item.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
