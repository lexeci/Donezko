'use client'
import generateKeyComp from "@/utils/generateKeyComp";
import { useProfile } from "@/hooks/useProfile";

export default function BlockContainerStatics() {
	const { data, isLoading } = useProfile()

	return (
		<div className="block-container grid grid-cols-2 grid-rows-2 gap-3 p-3 border border-borderColor h-auto w-auto">
			{data?.statistics.length ? (
				data.statistics.map(statistic => (
				<div
					className="block-container group flex flex-col items-center gap-6 p-3 pb-8 border border-borderColor h-auto hover:bg-foreground hover:text-background hover:border-foreground transition-all ease-in-out duration-200 w-auto"
					key={generateKeyComp(statistic.label)}
				>
					<div className="title w-full text-left">
						<h3>{statistic.label}</h3>
					</div>
					<div className="amount font-medium text-4xl">
						<p>{statistic.value}</p>
					</div>
				</div>
			))) : (
				<div>Statistics not loaded!</div>
			)}
		</div>
	);
}
