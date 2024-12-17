import { SITE_NAME } from "@/constants/seo.constants";
import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.scss";

import Footer from "@/components/elements/Footer";
import Header from "@/components/elements/Header";
import { Providers } from "./providers";

const inconsolata = Inconsolata({
  subsets: ["latin-ext"],
  variable: "--font-inconsolata",
  style: "normal",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Your best planner application to plan your day effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inconsolata.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="flex flex-col items-center justify-center pt-[82px] min-h-[70.75vh] overflow-hidden">
            {children}
          </main>
          <Footer />
          <Toaster theme="dark" position="bottom-right" duration={1500} />
        </Providers>
      </body>
    </html>
  );
}