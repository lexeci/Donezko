"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthForm } from "@/types/auth.types";

import { authService } from "@/services/auth.service";
import { AnimatedLink, Button, Field } from "@/src/components";

import { DASHBOARD_PAGES } from "@/src/config/pages-url.config";
import { Minus, Square, X } from "@phosphor-icons/react";
import styles from "./Authorization.module.scss";

export default function Authorization() {
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
		<div className="w-3/4 flex flex-col justify-center bg-background border border-foreground">
			<div className={styles.header}>
				<div className={styles.title}>
					<h4>Login application</h4>
				</div>
				<div className={styles.actions}>
					<div>
						<Minus size={8} />
					</div>
					<div>
						<Square size={8} />
					</div>
					<div>
						<X size={8} />
					</div>
				</div>
			</div>
			<form
				className="w-full relative flex flex-col items-center flex-wrap md:justify-between gap-y-3 px-6 py-8"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="register absolute top-2 right-2 text-xs">
					<AnimatedLink
						type="button"
						title={
							formType == "login" ? "Register me!" : "I already have account"
						}
						link={"#"}
						onClick={() =>
							setFormType(formType == "login" ? "register" : "login")
						}
					/>
				</div>
				<h1 className="text-3xl font-mono text-center w-full border-b border-borderColor pb-2 mb-4">
					{renderHeader()}
				</h1>
				<Field
					extra="flex flex-col max-w-80 w-full"
					id="email"
					label="Email:"
					placeholder="Enter email:"
					type="email"
					{...register("email", {
						required: "Email is required!",
					})}
				/>
				{formType == "register" && (
					<Field
						extra="flex flex-col max-w-80 w-full"
						id="name"
						label="Name:"
						placeholder="Enter name:"
						type="text"
						{...register("name", {
							required: "Name is required!",
						})}
					/>
				)}
				<Field
					extra="flex flex-col max-w-80 w-full"
					id="password"
					label="Password: "
					placeholder="Enter password: "
					type="password"
					{...register("password", {
						required: "Password is required!",
					})}
				/>
				<div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
					{formType == "login" ? (
						<Button type="button" block onClick={() => setFormType("login")}>
							Login
						</Button>
					) : (
						<Button type="button" block onClick={() => setFormType("register")}>
							Register
						</Button>
					)}
				</div>
			</form>
		</div>
	);
}
