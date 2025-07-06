import clsx from "clsx";
import Link from "next/link";
import styles from "./AnimatedLink.module.scss";

interface AnimatedLinkProps {
  /**
   * Type of the component: either "link" or "button"
   * @default "link"
   */
  type?: "link" | "button";

  /** URL or path to navigate to (used when type is "link") */
  link: string;

  /** Text displayed inside the link or button */
  title: string;

  /** Enables dark styling */
  dark?: boolean;

  /** Enables negative (inverted) styling */
  negative?: boolean;

  /** Target attribute for links (e.g., "_blank") */
  target?: string;

  /** Rel attribute for links (e.g., "noopener noreferrer") */
  rel?: string;

  /** Click event handler (used when type is "button") */
  onClick?: () => void;
}

/**
 * AnimatedLink component renders either a Next.js Link or a styled div acting as a button,
 * both with an animated underline effect.
 *
 * @param {AnimatedLinkProps} props - Props object
 * @param {("link"|"button")} [props.type="link"] - Type of component to render
 * @param {string} props.link - URL or path to navigate to (only for links)
 * @param {string} props.title - Text displayed inside the component
 * @param {boolean} [props.dark=false] - Enables dark styling
 * @param {boolean} [props.negative=false] - Enables negative styling
 * @param {string} [props.target] - Target attribute for link
 * @param {string} [props.rel] - Rel attribute for link
 * @param {() => void} [props.onClick] - Click handler (only for button type)
 *
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * ```tsx
 * <AnimatedLink type="link" link="/home" title="Home" dark />
 * <AnimatedLink type="button" title="Click me" onClick={() => alert("Clicked!")} />
 * ```
 */
export default function AnimatedLink({
  type = "link",
  link,
  title,
  dark = false,
  negative = false,
  target,
  rel,
  onClick,
}: AnimatedLinkProps) {
  const className = clsx(
    styles["underline-anim"],
    dark && styles.dark,
    negative && styles.negative
  );

  if (type === "link") {
    return (
      <Link href={link} target={target} rel={rel} className={className}>
        {title}
      </Link>
    );
  }

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      rel={rel}
    >
      {title}
    </div>
  );
}
