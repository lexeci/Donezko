import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { HandPrayerIcon } from "hugeicons-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Oh, no! Wrong page anyway...",
	...NO_INDEX_PAGE,
};

export default function NotFoundPage() {
	return (
		<div className="no-found flex flex-col justify-center items-center gap-3 text-foreground">
			<p className="text-5xl font-black tracking-widest">4 0 4</p>
			<p>Guess today is not your day if you are on this page.</p>
			<Link href="/" className="font-mono text-sm flex gap-x-3 pt-3">
				<HandPrayerIcon size={20} />
				<span>Please return me home!</span>
				<HandPrayerIcon size={20} />
			</Link>
		</div>
	);
}
