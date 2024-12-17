import BlockContainer from "./BlockContainer";

export default async function BlockContainerAdvice({data}: {data: string}) {
	return (
		<BlockContainer>
			<div className="title pb-2 border-b border-b-borderColor w-full">
				<h3>Your daily advice:</h3>
			</div>
			<div className="advice w-full">
        <p>{data ? data : "Sorry still keeping to load your advice :p"}</p>
			</div>
		</BlockContainer>
	);
}
