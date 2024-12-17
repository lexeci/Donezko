import {
	Banner,
	Faqs,
	Features,
	PageLayout,
	Welcome,
} from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Homepage",
	...INDEX_PAGE,
};

export default function Home() {
	return (
		<PageLayout>
			<Banner />
			<Features />
			<Faqs />
			<Welcome />
		</PageLayout>
	);
}
