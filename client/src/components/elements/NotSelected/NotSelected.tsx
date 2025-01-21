import {SmileyWink} from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";

export default function NotSelected({element}: { element: string }) {
    return (
        <div className={pageStyles["workspace-not-found-block"]}>
            <SmileyWink size={80} className="!animate-gentle-shake"/>
            <div className={pageStyles["workspace-not-found-block__title"]}>
                <h3>Oops! Someone forgot to select a {element.toLowerCase()} yet.</h3>
            </div>
            <div className={pageStyles["workspace-not-found-block__text-block"]}>
                <p>
                    Maybe someone forgot to approve it,
                    <br/> or you simply missed the chance to pick it.
                    <br/>
                    {"(Try selecting it again or send a gentle reminder to your admin.)"}
                    <br/>
                    {"Cookies might help, too! :)"}
                </p>
            </div>
        </div>
    );
}
