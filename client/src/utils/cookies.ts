// utils/cookies.ts
import Cookies from "js-cookie";

// Функція для збереження організації в cookies
export const saveOrganizationToCookies = (orgId: string): void => {
	Cookies.set("selectedOrganization", orgId, { expires: 365 }); // expires: 365 - зберігаємо на рік
};

// Функція для отримання організації з cookies
export const getOrganizationFromCookies = (): string | undefined => {
	const organizationId = Cookies.get("selectedOrganization");
	return organizationId; // Повертаємо або undefined, якщо cookie не знайдено
};
