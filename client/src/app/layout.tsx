import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import styles from "./page.module.scss";

import { Footer, Header } from "@/components/index";
import { Toaster } from "sonner";
import { Providers } from "./providers";

/**
 * Load GeistSans variable font from local file with CSS variable name.
 * Font weight range is defined from 100 to 900.
 */
const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

/**
 * Load GeistMono variable font from local file with CSS variable name.
 * Font weight range is defined from 100 to 900.
 */
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/**
 * Global metadata for the application.
 * Sets the page title and description for SEO purposes.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Donezko - plan your time",
  description:
    "Donezko - plan your time. Created by student. Inspired by diploma",
};

/**
 * RootLayout component wraps the entire application with global structure.
 * It includes the following:
 * - Global font configuration
 * - Header and Footer components for consistent layout
 * - Providers for application-wide state/context
 * - Toast notifications using Sonner
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The main application content
 * @returns {JSX.Element} - The complete HTML structure of the app
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Donezko" />
      </head>
      {/* Set global font and enable antialiasing */}
      <body className={`antialiased ${geistMono.variable} font-mono`}>
        <Providers>
          {/* Global header component */}
          <Header />

          {/* Main content area styled with layout module */}
          <main className={styles.main}>{children}</main>

          {/* Global footer component */}
          <Footer />
        </Providers>

        {/* Toast notification system with dark theme */}
        <Toaster theme="dark" position="bottom-right" duration={1500} />
      </body>
    </html>
  );
}
