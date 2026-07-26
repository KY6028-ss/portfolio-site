import type { Metadata } from "next";
import Markdown from "@/components/Markdown";
import { getProfile } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  // ルートセグメントには layout の title.template が適用されないため自前で連結する
  title: `このサイトについて | ${SITE_NAME}`,
};

// ブランドアイコン(公式ロゴ, viewBox 0 0 24 24)。label を小文字化したキーで引く。
// 未登録ラベルはアイコンではなくテキストにフォールバックする。
const SOCIAL_ICONS: Record<string, string> = {
  x: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  zenn: "M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z",
};

export default function ProfilePage() {
  const profile = getProfile();

  return (
    <>
      <h1>このサイトについて</h1>
      <h2>プロフィール</h2>
      <p>
        <strong>名前:</strong> {profile.name}
        {profile.role && <>（{profile.role}）</>}
      </p>
      {profile.links.length > 0 && (
        <ul className="list-none flex flex-wrap items-center gap-4 p-0">
          {profile.links.map((link) => {
            const iconPath = SOCIAL_ICONS[link.label.toLowerCase()];
            return (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex text-muted hover:text-accent transition-colors"
                >
                  {iconPath ? (
                    <svg
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={iconPath} />
                    </svg>
                  ) : (
                    link.label
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <Markdown>{profile.body}</Markdown>
      <section>
        <h3>サイトの趣旨</h3>
        <p className="whitespace-pre-line break-words">{profile.siteDescription}</p>
      </section>
    </>
  );
}
