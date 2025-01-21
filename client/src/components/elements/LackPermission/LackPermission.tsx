import {SmileyXEyes} from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";

export default function LackPermission() {
    return (
        <div className={pageStyles["workspace-not-found-block"]}>
            <SmileyXEyes size={80} className="!animate-gentle-shake"/>
            <div className={pageStyles["workspace-not-found-block__title"]}>
                <h3>Oops! Someone lack permissions to view the content.</h3>
            </div>
            <div className={pageStyles["workspace-not-found-block__text-block"]}>
                <p>
                    It seems this has decided to take an unapproved coffee break. ☕
                    <br/>
                    Maybe it got deleted, or perhaps you're not on the VIP guest list.
                    <br/>
                    {
                        "(Try refreshing the page, or send a friendly nudge to your admin if you think this is unfair. Perhaps bring cookies?)"
                    }
                </p>
            </div>
        </div>
    );
}
