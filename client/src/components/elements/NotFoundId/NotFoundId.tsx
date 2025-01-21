import {SmileyNervous} from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";

export default function NotFoundId({elementTitle}: { elementTitle: string }) {
    return (
        <div className={pageStyles["workspace-not-found-block"]}>
            <SmileyNervous size={80} className="!animate-bounce"/>
            <div className={pageStyles["workspace-not-found-block__title"]}>
                <h3>
                    Oops! <span>{elementTitle}</span> not found.
                </h3>
            </div>
            <div className={pageStyles["workspace-not-found-block__text-block"]}>
                <p>
                    It seems this <span>{elementTitle}</span> has
                    gone on an unexpected vacation.
                    <br/>
                    Maybe it was deleted, or perhaps you no longer have access.
                    <br/>
                    {
                        "(Try refreshing the page or contact your admin if you think this is a mistake.)"
                    }
                </p>
            </div>
        </div>
    );
}
