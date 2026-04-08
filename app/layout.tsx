import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
