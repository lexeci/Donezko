import {SmileyMeh} from "@phosphor-icons/react/dist/ssr";
import pageStyles from "@/app/page.module.scss";

export default function NoOrganization() {
    return (
        <div
            className={pageStyles["workspace-not-found-block"]}>
            <SmileyMeh size={80}/>
            <div className={pageStyles["workspace-not-found-block__title"]}>
                <h3>You need to select an organization.</h3>
            </div>
            <div className={pageStyles["workspace-not-found-block__text-block"]}>
                <p>
                    Before you start you should choose an organization.
                    <br/>
                    You can do it by choosing it from header or on the left sidebar
                    <br/>
                    {
                        "(Choose a organizations tab and click the available one for you)"
                    }
                </p>
            </div>
        </div>
    )
}