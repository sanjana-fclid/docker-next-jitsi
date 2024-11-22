import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SupabaseProvider from "@/components/providers/SupabaseProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "DataFab Collab",
	description:
		"Connect, collaborate, and celebrate from anywhere with DataFab Secure Collaboration Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SupabaseProvider>{children}</SupabaseProvider>
			</body>
		</html>
	);
}
