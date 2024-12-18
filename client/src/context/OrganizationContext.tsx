import {
	getOrganizationFromCookies,
	removeOrganizationFromCookies,
	saveOrganizationToCookies,
} from "@/utils/cookies"; // Функції для роботи з cookies
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";

// Тип для значення контексту
interface OrganizationContextType {
	organizationId: string | null;
	saveOrganization: (orgId: string | null) => void;
}

// Створюємо контекст з типом
const OrganizationContext = createContext<OrganizationContextType | null>(null);

export const useOrganization = (): OrganizationContextType => {
	const context = useContext(OrganizationContext);
	if (!context) {
		const errorText =
			"useOrganization must be used within an OrganizationProvider";
		toast.error("Something went wrong :(");
		console.error(errorText);
		throw new Error(errorText);
	}
	return context;
};

export const OrganizationProvider = ({ children }: PropsWithChildren<{}>) => {
	const [organizationId, setOrganizationId] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const savedOrganizationId = getOrganizationFromCookies();
		const isWorkspacePath = pathname.startsWith("/workspace");

		if (savedOrganizationId) {
			setOrganizationId(savedOrganizationId);

			// Якщо ми у workspace, але не на сторінці вибору організації, перенаправляємо на основний workspace
			if (isWorkspacePath && pathname === "/workspace/organizations") {
				router.push("/workspace");
			}
		} else {
			// Якщо організація не вибрана і ми у workspace
			if (
				isWorkspacePath &&
				pathname !== "/workspace" &&
				pathname !== "/workspace/organizations"
			) {
				router.push("/workspace");
			}
		}
	}, [router, pathname]);

	// Функція для збереження організації
	const saveOrganization = (orgId: string | null) => {
		if (orgId) {
			saveOrganizationToCookies(orgId);
			setOrganizationId(orgId);
		} else {
			removeOrganizationFromCookies(); // Видаляємо організацію з куків
			setOrganizationId(null);
		}
	};

	return (
		<OrganizationContext.Provider value={{ organizationId, saveOrganization }}>
			{children}
		</OrganizationContext.Provider>
	);
};
