"use client";

import pageStyles from "@/app/page.module.scss";
import styles from "./Settings.module.scss";

import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { useInitialUserData } from "@/hooks/user/useInitialUserData";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserFormType } from "@/types/auth.types";
import { Button, Field } from "@/components/index";
import { useState } from "react";
import { CoinVertical } from "@phosphor-icons/react/dist/ssr";

/**
 * Settings component
 *
 * Displays a form for the user to update their settings such as email,
 * name, city, password, and Pomodoro timer intervals.
 *
 * Utilizes react-hook-form for form management and validation,
 * custom hooks for loading initial user data and updating the user,
 * and shows a loading spinner while fetching initial data.
 *
 * @returns {JSX.Element} The settings form or a loading indicator.
 */
export default function Settings() {
  // State to track if user data is still loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize react-hook-form with user form type and onChange mode
  const { register, handleSubmit, reset } = useForm<UserFormType>({
    mode: "onChange",
  });

  // Custom hook to load initial user data and reset the form when ready
  useInitialUserData(reset, setIsLoading);

  // Hook to perform user update mutation
  const { isPending, mutate } = useUpdateUser();

  /**
   * Form submission handler.
   *
   * Extracts password separately to avoid sending empty password,
   * then calls mutate function to update user data.
   *
   * @param {UserFormType} data - The submitted form data.
   */
  const onSubmit: SubmitHandler<UserFormType> = (data) => {
    const { password, ...rest } = data;

    mutate({
      ...rest,
      password: password || undefined,
    });
  };

  // Render loading spinner if data is still loading
  if (isLoading) {
    return (
      <div className={pageStyles["workspace-not-loaded-coin"]}>
        <CoinVertical size={80} />
      </div>
    );
  }

  // Render the settings form when data is loaded
  return (
    <div className={pageStyles["workspace-content-center"]}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <div>
            {/* Email field with required validation */}
            <Field
              id="email"
              label="Email: "
              placeholder="Enter email: "
              type="email"
              {...register("email", {
                required: "Email is required!",
              })}
              extra={styles.fields}
            />

            {/* Optional Name field */}
            <Field
              id="name"
              label="Name: "
              placeholder="Enter name: "
              {...register("name")}
              extra={styles.fields}
            />

            {/* Optional City field */}
            <Field
              id="city"
              label="City: "
              placeholder="Enter city: "
              {...register("city")}
              extra={styles.fields}
            />

            {/* Password field (optional) */}
            <Field
              id="password"
              label="Password: "
              placeholder="Enter password: "
              type="password"
              {...register("password")}
              extra={styles["fields__last"]}
            />
          </div>

          <div>
            {/* Numeric field for Work Interval */}
            <Field
              id="workInterval"
              label="Work interval (min.): "
              placeholder="Enter work interval (min.): "
              isNumber
              {...register("workInterval", {
                valueAsNumber: true,
              })}
              extra={styles.fields}
            />

            {/* Numeric field for Break Interval */}
            <Field
              id="breakInterval"
              label="Break interval (min.): "
              placeholder="Enter break interval (min.): "
              isNumber
              {...register("breakInterval", {
                valueAsNumber: true,
              })}
              extra={styles.fields}
            />

            {/* Numeric field for Intervals Count */}
            <Field
              id="intervalsCount"
              label="Intervals count (max 10): "
              placeholder="Enter intervals count (max 10): "
              isNumber
              {...register("intervalsCount", {
                valueAsNumber: true,
              })}
              extra={styles["fields__lasting"]}
            />
          </div>
        </div>

        {/* Save button, disabled while mutation is pending */}
        <Button type="button" disabled={isPending} fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
}
