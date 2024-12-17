"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthForm } from "@/types/auth.types";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";

import { Button } from "@/components/ui/buttons/Button";
import { Field } from "@/components/ui/fields/Field";
import { authService } from "@/services/auth.service";

export function Authorization() {
	const { register, handleSubmit, reset } = useForm<AuthForm>({
		mode: "onChange",
	});

	const [formType, setFormType] = useState<"login" | "register">("login"); // Замінили булеве значення на явний тип

	const { push } = useRouter();

	// Використовуємо useCallback для оптимізації
	const { mutate } = useMutation({
		mutationKey: ["auth"],
		mutationFn: useCallback(
			(data: AuthForm) => authService.main(formType, data),
			[formType]
		),
		onSuccess: () => {
			toast.success(`Successfully ${formType}ed!`);
			reset();
			push(DASHBOARD_PAGES.HOME);
		},
	});

	const onSubmit: SubmitHandler<AuthForm> = data => {
		mutate(data);
	};

	// Додано кастомний хедер, який змінюється відповідно до типу форми
	const renderHeader = () => {
		return formType === "login" ? "Login" : "Register";
	};

	return (
		<div className="flex p-6 justify-center w-full">
			<form
				className="w-1/4 relative flex flex-col flex-wrap md:justify-between bg-blockColor border border-borderColor p-6 flex-none shadow-xl gap-y-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-3xl font-mono text-center w-full border-b border-borderColor pb-6">
					{renderHeader()}
				</h1>
				<Field
					id="email"
					label="Email:"
					placeholder="Enter email:"
					type="email"
					{...register("email", {
						required: "Email is required!",
					})}
				/>
				<Field
					id="password"
					label="Password: "
					placeholder="Enter password: "
					type="password"
					{...register("password", {
						required: "Password is required!",
					})}
					extra="pb-3"
				/>
				<div className="flex items-center gap-3 justify-center">
					<Button onClick={() => setFormType("login")}>Login</Button>
					<Button onClick={() => setFormType("register")}>Register</Button>
				</div>
			</form>
		</div>
	);
}
