import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
        <main
          id="main"
          className="max-w-[800px] bg-surface rounded-lg shadow-card mx-2 p-4 sm:mx-auto sm:p-8"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
