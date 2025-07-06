"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthForm } from "@/types/auth.types";

import { AnimatedLink, Button, Field } from "@/components/index";
import { authService } from "@/services/auth.service";

import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { Minus, Square, X } from "@phosphor-icons/react";
import styles from "./Authorization.module.scss";
import pageStyles from "@/app/page.module.scss";
import { useOrganization } from "@/context/OrganizationContext";

/**
 * Authorization component handles user login and registration forms,
 * managing form state and submission with validation.
 *
 * It switches between "login" and "register" modes and calls the appropriate
 * authentication service method. On success, it shows a toast, resets the form,
 * and navigates to the dashboard home page.
 *
 * @returns {JSX.Element} The rendered Authorization form component
 */
export default function Authorization() {
  // Access method to reset saved organization context state
  const { saveOrganization } = useOrganization();

  // Initialize react-hook-form with AuthForm type and onChange validation mode
  const { register, handleSubmit, reset } = useForm<AuthForm>({
    mode: "onChange",
  });

  // State to track current form type: "login" or "register"
  const [formType, setFormType] = useState<"login" | "register">("login");

  // Next.js router push method for navigation
  const { push } = useRouter();

  /**
   * React Query mutation hook for authentication request.
   * Uses useCallback to memoize mutation function and avoid unnecessary re-renders.
   * The mutation function calls authService.main with current formType and form data.
   *
   * On success, shows a success toast, resets the form fields,
   * and navigates to the dashboard home page.
   */
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

  /**
   * Form submit handler, triggers the mutation with form data.
   * Also resets the organization context state to null.
   *
   * @param {AuthForm} data - The data collected from the form inputs
   */
  const onSubmit: SubmitHandler<AuthForm> = (data) => {
    saveOrganization(null);
    mutate(data);
  };

  /**
   * Returns the form header text based on the current form type.
   *
   * @returns {string} "Login" if formType is "login", else "Register"
   */
  const renderHeader = () => {
    return formType === "login" ? "Login" : "Register";
  };

  return (
    <div className={styles.authorization}>
      {/* Header section with application title and window control icons */}
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

      {/* Form element with submit handler */}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Link to toggle between login and register forms */}
        <div className={styles.register}>
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

        {/* Form header showing either "Login" or "Register" */}
        <h1 className={styles.content}>{renderHeader()}</h1>

        {/* Email input field with validation */}
        <Field
          extra={pageStyles["fields-default"]}
          id="email"
          label="Email:"
          placeholder="Enter email:"
          type="email"
          {...register("email", {
            required: "Email is required!",
          })}
        />

        {/* Additional fields shown only in registration form */}
        {formType == "register" && (
          <>
            {/* Name input field with validation */}
            <Field
              extra={pageStyles["fields-default"]}
              id="name"
              label="Name:"
              placeholder="Enter name:"
              type="text"
              {...register("name", {
                required: "Name is required!",
              })}
            />

            {/* City input field with validation */}
            <Field
              extra={pageStyles["fields-default"]}
              id="city"
              label="City:"
              placeholder="Enter your city:"
              type="text"
              {...register("city", {
                required: "City is required!",
              })}
            />
          </>
        )}

        {/* Password input field with validation */}
        <Field
          extra={pageStyles["fields-default"]}
          id="password"
          label="Password: "
          placeholder="Enter password: "
          type="password"
          {...register("password", {
            required: "Password is required!",
          })}
        />

        {/* Action button toggles based on current form type */}
        <div className={styles["action-btn"]}>
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
