import type { Metadata } from "next";
import Markdown from "@/components/Markdown";
import { getProfile } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  // ルートセグメントには layout の title.template が適用されないため自前で連結する
  title: `このサイトについて | ${SITE_NAME}`,
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
        <ul className="list-none flex flex-wrap gap-4 p-0">
          {profile.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener">
                {link.label}
              </a>
            </li>
          ))}
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
