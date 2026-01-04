import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Bento Focus",
    description: "Soft, minimalistic focus timer for deep work sessions.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#F8F8F8" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
