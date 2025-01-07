import {PageHeader, PageLayout, Settings} from "@/components/index";
import {NO_INDEX_PAGE, SITE_NAME} from "@/constants/seo.constants";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: `${SITE_NAME} - Settings`,
    ...NO_INDEX_PAGE,
};

export default function Teams() {
    return (
        <PageLayout>
            <PageHeader
                pageTitle="Settings"
                title="Manage your settings"
                desc="This page is dedicated for managing settings which are available for you."
            />
            <Settings/>
        </PageLayout>
    );
}
