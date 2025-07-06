import { AnimatedLink, Logo } from "@/components/index";
import generateKeyComp from "@/utils/generateKeyComp";
import styles from "./Footer.module.scss";

/**
 * Footer component renders the website footer section with logo, description,
 * contact information, resource links, and legal links.
 *
 * @returns {JSX.Element} The footer element
 */
export default function Footer() {
  // Get the current year for copyright display
  const currentYear = new Date().getFullYear();

  // Array of grouped navigation links for footer sections
  const links = [
    [
      { link: "#", title: "Github project page" },
      { link: "#", title: "Project documentation" },
    ],
    [
      { link: "/faqs", title: "FAQs" },
      { link: "/privacy-policy", title: "Privacy Policy" },
      { link: "/terms-of-service", title: "Terms of Service" },
      { link: "/contribution-guidelines", title: "Contribution Guidelines" },
      { link: "/legal", title: "Legal" },
    ],
  ];

  // Contact information list with labels and links
  const contact = [
    {
      link: "mailto:admin@Donezko.com",
      title: "admin@Donezko.com",
      label: "Email:",
    },
  ];

  // Description text about the platform
  const description =
    "Donezko is a free task management platform. It provides Kanban boards and task lists, catering to both structured and flexible planning styles.";

  // Copyright and ownership text
  const credentials = `© ${currentYear} Donezko. All Rights Reserved by Lexeci.`;

  // Additional footer message about the team (unused in JSX)
  const teams = "Created with passion… and a few sleepless nights. ☉ ‿ ⚆";

  return (
    <div className={styles.footer}>
      {/* Top part of footer with logo, description, contact, and resources */}
      <div className={styles["footer__top"]}>
        <div className={styles["footer__column"]}>
          {/* Logo component */}
          <Logo />
          {/* Description paragraph */}
          <div className={styles["footer__description"]}>
            <p>{description}</p>
          </div>
        </div>

        {/* Contact information block */}
        <div className={styles["footer__link-group"]}>
          <div>
            <p>Contact</p>
            <ul className={styles["footer__link-group__block"]}>
              {/* Map through contact items and render links */}
              {contact.map((item, i) => (
                <li key={generateKeyComp(`${item.title}_${i}`)}>
                  <p>
                    {item.label}{" "}
                    <AnimatedLink link={item.link} title={item.title} dark />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resources links block */}
        <div className={styles["footer__link-group"]}>
          <div>
            <p>Resources</p>
            <ul className={styles["footer__link-group__block"]}>
              {/* Map through first group of links and render AnimatedLink components */}
              {links[0].map((item, i) => (
                <li key={generateKeyComp(`${item.title}_${i}`)}>
                  <AnimatedLink link={item.link} title={item.title} dark />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom part of footer with copyright and additional links */}
      <div className={styles["footer__bottom"]}>
        {/* Copyright text */}
        <p>{credentials}</p>
        {/* Map through second group of links and render footer bottom links */}
        <ul className={styles["footer__bottom__links"]}>
          {links[1].map((item, i) => (
            <li
              className={styles["footer__bottom__links__item"]}
              key={generateKeyComp(`${item.title}_${i}`)}
            >
              <AnimatedLink link={item.link} title={item.title} dark />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
