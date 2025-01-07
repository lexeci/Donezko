import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.scss";
import styles from "./page.module.scss";

import {Footer, Header} from "@/components/index";
import {Toaster} from "sonner";
import {Providers} from "./providers";

const geistSans = localFont({
    src: "../../public/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../../public/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "TPlanner - plan your time",
    description:
        "TPlanner - plan your time. Created by student. Inspired by diploma",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`antialiased ${geistMono.variable} font-mono`}>
        <Providers>
            <Header/>
            <main className={styles.main}>{children}</main>
            <Footer/>
        </Providers>
        <Toaster theme="dark" position="bottom-right" duration={1500}/>
        </body>
        </html>
    )
}
