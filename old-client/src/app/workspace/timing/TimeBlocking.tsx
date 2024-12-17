"use client";

import { FormProvider, useForm } from "react-hook-form";

import type { TimeBlockFormValues } from "@/types/time-block.types";

import { TimeBlockingList } from "./TimeBlockingList";
import { TimeBlockForm } from "./controls/TimeBlockForm";

export function TimeBlocking() {
	const methods = useForm<TimeBlockFormValues>();

	return (
		<FormProvider {...methods}>
			<div className="grid grid-cols-2 gap-12">
				<TimeBlockingList />
				<TimeBlockForm />
			</div>
		</FormProvider>
	);
}
