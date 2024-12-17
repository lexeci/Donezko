"use client";

import { CaretDown, CaretUp } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import styles from "./Accordion.module.scss";

interface Accordion {
	title: string;
	answer: string;
}

export default function Accordion({ title, answer }: Accordion) {
	// Створюємо state для відкриття/закриття кожного FAQ
	const [isOpen, setIsOpen] = useState<boolean>(false); // Для 5 FAQ елементів

	// Функція для зміни стану відкриття/закриття
	const toggleFAQ = () => {
		setIsOpen(prevState => !prevState);
	};

	return (
		<div className={styles.accordion}>
			<div
				className={styles["accordion__container"]}
				onClick={() => toggleFAQ()}
			>
				<div className={styles["accordion__question"]}>
					<h4>{title}</h4>
					<span>
						{isOpen ? <CaretUp size={32} /> : <CaretDown size={32} />}
					</span>
				</div>
			</div>
			<div
				className={`${styles["accordion__answer"]} ${
					isOpen && styles["accordion__answer__active"]
				}`}
			>
				<p>
					{"-->"} {answer}
				</p>
			</div>
		</div>
	);
}
