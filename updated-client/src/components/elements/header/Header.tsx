import {
	Button,
	DigitalClock,
	HeaderUserBadge,
	Logo,
	ThemeSwitcher,
} from "@/components/index";
import generateKeyComp from "@/src/utils/generateKeyComp";
import styles from "./Header.module.scss";

export default function Header() {
	const navigation = [
		{ link: "/", title: "Homepage" },
		{ link: "/about", title: "about us" },
		{ link: "/dashboard", title: "Dashboard" },
	];
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<Logo />
				<ul className={styles.links}>
					{navigation.map((item, i) => (
						<li key={generateKeyComp(`${item.title}_${i}`)}>
							<Button type="link" link={item.link} negative block>
								{item.title}
							</Button>
						</li>
					))}
				</ul>
				<div className="options flex flex-row justify-center items-center gap-x-6">
					<ThemeSwitcher aria-label="Toggle theme" />
					<DigitalClock aria-label="Current time" />
					<HeaderUserBadge aria-label="User options" />
				</div>
			</div>
		</header>
	);
}
