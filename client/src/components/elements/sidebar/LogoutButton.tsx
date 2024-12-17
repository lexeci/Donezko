import { Button } from "@/components/index";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
	const router = useRouter();

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			router.push("/auth");
		},
	});

	// Wrapping mutate in a function to ensure proper typing
	const handleLogout = () => {
		mutate();
	};

	return (
		<Button
			type="link"
			link="/workspace/"
			onClick={(e: any) => {
				e.preventDefault(); // Викликаємо preventDefault
				handleLogout();
			}}
			fullWidth
			block
			negative
		>
			Log Out
		</Button>
	);
}
