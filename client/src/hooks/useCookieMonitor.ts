import Cookies from "js-cookie";
import { useEffect } from "react";

export const useCookieMonitor = (
	cookieName: string,
	onChange: () => void,
	onRemove: () => void
) => {
	useEffect(() => {
		const interval = setInterval(() => {
			const cookieValue = Cookies.get(cookieName);

			if (cookieValue) {
				onChange(); // Викликаємо колбек, якщо cookie існує
			} else {
				onRemove(); // Викликаємо колбек, якщо cookie зникла
			}
		}, 1000); // Перевіряємо раз на секунду (налаштуйте під ваші потреби)

		return () => clearInterval(interval); // Прибираємо інтервал, якщо компонент розмонтується
	}, [cookieName, onChange, onRemove]);
};
