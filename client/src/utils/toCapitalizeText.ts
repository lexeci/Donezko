export default function toCapitalizeText(val: string) {
	return (
		String(val)
			.replace(/_/g, " ") // Замінюємо всі _ на пробіли
			.charAt(0)
			.toUpperCase() +
		String(val)
			.replace(/_/g, " ") // Замінюємо всі _ на пробіли
			.slice(1)
			.toLowerCase()
	);
}
