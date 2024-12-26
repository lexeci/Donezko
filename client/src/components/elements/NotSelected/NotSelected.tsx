import { SmileyWink } from "@phosphor-icons/react/dist/ssr";

export default function NotSelected({ element }: { element: string }) {
	return (
		<div className="h-full flex flex-col justify-center items-center gap-y-4 max-w-[40rem] mx-auto text-center">
			<SmileyWink size={80} className="animate-gentle-shake" />
			<div className="title text-xl font-bold">
				<h3>Oops! Someone forgot to select a {element.toLowerCase()} yet.</h3>
			</div>
			<div className="text-block">
				<p>
					Maybe someone forgot to approve it,
					<br /> or you simply missed the chance to pick it.
					<br />
					{"(Try selecting it again or send a gentle reminder to your admin.)"}
					<br />
					{"Cookies might help, too! :)"}
				</p>
			</div>
		</div>
	);
}
