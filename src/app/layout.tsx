import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Heal-In-One",
	description: "Your medical guide",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={inter.className}
				style={{ minWidth: "100%", minHeight: "100%" }}
			>
				<Providers> {children}</Providers>
			</body>
		</html>
	);
}
