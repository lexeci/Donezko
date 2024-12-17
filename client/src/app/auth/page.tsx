import { Authorization, WindowContainer } from "@/src/components";

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
