"use client";

import styles from "./PageHeader.module.scss";

import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";

export default function JoinCode({ joinCode }: { joinCode: string | boolean }) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		try {
			// Копіювання тексту у буфер обміну
			await navigator.clipboard.writeText(joinCode as string);
			setIsCopied(true);
			// Скидання статусу через 2 секунди
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err: any) {
			toast.error("Failed to copy text: " + err);
			console.error("Failed to copy text:", err);
		}
	};

	return (
		<p
			className={clsx(styles["join-code"], "bg-radial-grid-mini")}
			onClick={() => handleCopy()}
		>
			{isCopied ? (
				<span>Join Code copied!</span>
			) : (
				<span>
					Join Code:<span>{joinCode}</span>
				</span>
			)}
		</p>
	);
}
