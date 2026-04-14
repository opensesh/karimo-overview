import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://karimo-overview.vercel.app"),
  title: "KARIMO [Claude Code Plugin Overview]",
  description: "What happens when you run /karimo:plan? PRD interviews, agent orchestration, automated review—mapped step by step.",
  openGraph: {
    title: "KARIMO [Claude Code Plugin Overview]",
    description: "Interactive overview of how KARIMO transforms requirements into shipped code.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "KARIMO — Agent orchestration for shipping code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KARIMO [Claude Code Plugin Overview]",
    description: "Interactive overview of how KARIMO transforms requirements into shipped code.",
    images: ["/opengraph-image.jpg"],
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
      <body className="min-h-full flex flex-col relative">
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
