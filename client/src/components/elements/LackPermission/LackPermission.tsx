import { SmileyXEyes } from "@phosphor-icons/react/dist/ssr";

export default function LackPermission() {
	return (
		<div className="h-full flex flex-col justify-center items-center gap-y-4 max-w-[40rem] mx-auto text-center">
			<SmileyXEyes size={80} className="animate-gentle-shake" />
			<div className="title text-xl font-bold">
				<h3>Oops! Someone lack permissions to view the content.</h3>
			</div>
			<div className="text-block">
				<p>
					It seems this has decided to take an unapproved coffee break. ☕
					<br />
					Maybe it got deleted, or perhaps you're not on the VIP guest list.
					<br />
					{
						"(Try refreshing the page, or send a friendly nudge to your admin if you think this is unfair. Perhaps bring cookies?)"
					}
				</p>
			</div>
		</div>
	);
}
