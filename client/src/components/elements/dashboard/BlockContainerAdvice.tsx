"use client";

import { useFetchAdvice } from "@/hooks/workspace/useFetchAdvice";
import BlockContainer from "./BlockContainer";

export default function BlockContainerAdvice() {
	const { adviceData, isDataLoaded } = useFetchAdvice();

	return (
		<BlockContainer>
			<div className="title pb-2 border-b border-b-borderColor w-full">
				<h3>Your daily advice:</h3>
			</div>
			<div className="advice w-full">
				<p>
					{(isDataLoaded && adviceData?.slip.advice) ||
						"Sorry, still loading your advice :p"}
				</p>
			</div>
		</BlockContainer>
	);
}
