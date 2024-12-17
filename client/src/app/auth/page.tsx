import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Authorization, WindowContainer } from "@/src/components";

export const metadata: Metadata = {
	title: "Authorization",
	...NO_INDEX_PAGE,
};

export default function AuthPage() {
	return (
		<div className="authorization w-[110vh] mx-auto">
			<WindowContainer
				title={"TPlanner Authorization"}
				subtitle={"Login.exe"}
				fullPage
			>
				<Authorization />
			</WindowContainer>
		</div>
	);
}
