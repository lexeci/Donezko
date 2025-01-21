import {AnimatedLink, Logo} from "@/components/index";
import generateKeyComp from "@/utils/generateKeyComp";
import styles from "./Footer.module.scss";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const links = [
        [
            {link: "#", title: "Github project page"},
            {link: "#", title: "Project documentation"},
        ],
        [
            {link: "/faqs", title: "FAQs"},
            {link: "/privacy-policy", title: "Privacy Policy"},
            {link: "/terms-of-service", title: "Terms of Service"},
            {link: "/contribution-guidelines", title: "Contribution Guidelines"},
            {link: "/legal", title: "Legal"},
        ],
    ];

    const contact = [
        {
            link: "mailto:admin@tplanner.com",
            title: "admin@tplanner.com",
            label: "Email:",
        },
    ];

    const description =
        "TPlanner is a free task management platform. It provides Kanban boards and task lists, catering to both structured and flexible planning styles.";

    const credentials = `© ${currentYear} TPlanner. All Rights Reserved by Andriy Neaijko.`;

    const teams = "Created with passion… and a few sleepless nights. ☉ ‿ ⚆";

    return (
        <div className={styles.footer}>
            <div className={styles["footer__top"]}>
                <div className={styles["footer__column"]}>
                    <Logo/>
                    <div className={styles["footer__description"]}>
                        <p>{description}</p>
                    </div>
                </div>
                <div className={styles["footer__link-group"]}>
                    <div>
                        <p>Contact</p>
                        <ul className={styles["footer__link-group__block"]}>
                            {contact.map((item, i) => (
                                <li key={generateKeyComp(`${item.title}_${i}`)}>
                                    <p>
                                        {item.label}{" "}
                                        <AnimatedLink link={item.link} title={item.title} dark/>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles["footer__link-group"]}>
                    <div>
                        <p>Resources</p>
                        <ul className={styles["footer__link-group__block"]}>
                            {links[0].map((item, i) => (
                                <li key={generateKeyComp(`${item.title}_${i}`)}>
                                    <AnimatedLink link={item.link} title={item.title} dark/>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles["footer__bottom"]}>
                <p>{credentials}</p>
                <ul className={styles["footer__bottom__links"]}>
                    {links[1].map((item, i) => (
                        <li
                            className={styles["footer__bottom__links__item"]}
                            key={generateKeyComp(`${item.title}_${i}`)}
                        >
                            <AnimatedLink link={item.link} title={item.title} dark/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
