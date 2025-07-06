import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { authService } from "@/services/auth.service";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * LogoutButton component
 *
 * Renders a button that logs the user out, clears the organization context,
 * and redirects to the authentication page.
 *
 * @returns {JSX.Element} A logout button
 */
export default function LogoutButton() {
  const { saveOrganization } = useOrganization();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push("/auth");
    },
  });

  /**
   * Handles the logout process by clearing organization context
   * and triggering the logout mutation.
   */
  const handleLogout = () => {
    saveOrganization(null);
    mutate();
  };

  /**
   * Handles click event on the logout button.
   * Prevents default link behavior and initiates logout.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e Click event
   */
  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleLogout();
  };

  return (
    <Button
      type="link"
      link={DASHBOARD_PAGES.HOME}
      onClick={onClickHandler}
      fullWidth
      block
      negative
    >
      Log Out
    </Button>
  );
}
