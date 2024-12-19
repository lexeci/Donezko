import { SmileyNervous } from "@phosphor-icons/react/dist/ssr";

export default function NotFoundId({ elementTitle }: { elementTitle: string }) {
	return (
		<div className="h-full flex flex-col justify-center items-center gap-y-4 max-w-[40rem] mx-auto text-center">
			<SmileyNervous size={80} className="animate-bounce" />
			<div className="title text-xl font-bold">
				<h3>
					Oops! <span className="capitalize">{elementTitle}</span> not found.
				</h3>
			</div>
			<div className="text-block">
				<p>
					It seems this <span className="lowercase">{elementTitle}</span> has
					gone on an unexpected vacation.
					<br />
					Maybe it was deleted, or perhaps you no longer have access.
					<br />
					{
						"(Try refreshing the page or contact your admin if you think this is a mistake.)"
					}
				</p>
			</div>
		</div>
	);
}
