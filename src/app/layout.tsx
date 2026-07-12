import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="bg-canvas text-foreground">
        <a
          href="#main"
          className="absolute -top-12 left-2 z-50 px-4 py-2 bg-accent text-accent-contrast rounded no-underline transition-[top] duration-150 focus:top-2"
        >
          本文へスキップ
        </a>
        <header>
          <Header />
        </header>
        <div className="max-w-[1080px] mx-auto flex items-start justify-center gap-6 px-2">
          <Sidebar />
          <main
            id="main"
            className="w-full max-w-[800px] min-w-0 bg-surface rounded-lg shadow-card p-4 sm:p-8"
          >
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
