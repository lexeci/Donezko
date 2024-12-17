import BlockContainer from "./BlockContainer";

interface BlockContainerAdviceProps {
	data?: string; // Made data optional
}

export default function BlockContainerAdvice({
	data,
}: BlockContainerAdviceProps) {
	return (
		<BlockContainer>
			<div className="title pb-2 border-b border-b-borderColor w-full">
				<h3>Your daily advice:</h3>
			</div>
			<div className="advice w-full">
				<p>{data || "Sorry, still loading your advice :p"}</p>
			</div>
		</BlockContainer>
	);
}
