import {
	getOrganizationFromCookies,
	removeOrganizationFromCookies,
	saveOrganizationToCookies,
} from "@/utils/cookies"; // Functions to interact with cookies
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";
import { DASHBOARD_PAGES } from "../pages-url.config";

// Type for the context value
interface OrganizationContextType {
	organizationId: string | null; // The current organization ID
	saveOrganization: (orgId: string | null) => void; // Function to save the organization ID
}

// Create the context with the type
const OrganizationContext = createContext<OrganizationContextType | null>(null);

/**
 * Custom hook to use the OrganizationContext.
 * Throws an error if the hook is used outside the OrganizationProvider.
 *
 * @returns {OrganizationContextType} The current organization data and the save function.
 */
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

/**
 * Provider component that manages the organization context.
 * This provider will ensure that the organization ID is consistent and available across the app.
 *
 * @param {PropsWithChildren} children - The child components wrapped by this provider.
 * @returns {JSX.Element} The provider component with its children.
 */
export const OrganizationProvider = ({ children }: PropsWithChildren<{}>) => {
	const [organizationId, setOrganizationId] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	// Effect to load organization from cookies and handle redirection
	useEffect(() => {
		const savedOrganizationId = getOrganizationFromCookies();
		const isWorkspacePath = pathname.startsWith(DASHBOARD_PAGES.HOME);

		if (savedOrganizationId) {
			setOrganizationId(savedOrganizationId);

			// Redirect to the main workspace if in workspace and not on the organizations page
			if (isWorkspacePath && pathname === DASHBOARD_PAGES.ORGANIZATIONS) {
				router.push(DASHBOARD_PAGES.HOME);
			}
		} else {
			// Redirect to the workspace if no organization is selected and in workspace
			if (
				isWorkspacePath &&
				pathname !== DASHBOARD_PAGES.HOME &&
				pathname !== DASHBOARD_PAGES.ORGANIZATIONS
			) {
				router.push(DASHBOARD_PAGES.HOME);
			}
		}
	}, [router, pathname]);

	/**
	 * Saves or removes the organization from both state and cookies.
	 *
	 * @param {string | null} orgId - The organization ID to save, or null to remove it.
	 */
	const saveOrganization = (orgId: string | null) => {
		if (orgId) {
			saveOrganizationToCookies(orgId); // Save the organization ID to cookies
			setOrganizationId(orgId); // Set it in the state
		} else {
			removeOrganizationFromCookies(); // Remove organization from cookies
			setOrganizationId(null); // Clear organization ID from the state
		}
	};

	// Return the provider with the context value
	return (
		<OrganizationContext.Provider value={{ organizationId, saveOrganization }}>
			{children}
		</OrganizationContext.Provider>
	);
};
