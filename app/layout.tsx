import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KARIMO Unpacked",
  description: "What happens when you run /karimo:plan? PRD interviews, agent orchestration, automated review—mapped step by step.",
  openGraph: {
    title: "KARIMO Unpacked",
    description: "Interactive overview of how KARIMO transforms requirements into shipped code.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KARIMO Unpacked",
    description: "Interactive overview of how KARIMO transforms requirements into shipped code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-charcoal)] text-[var(--color-vanilla)]">
        {children}
      </body>
    </html>
  );
}
