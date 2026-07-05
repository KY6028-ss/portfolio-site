import type { Metadata } from "next";
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
      </p>
      <section>
        <h3>自己紹介</h3>
        <p className="whitespace-pre-line break-words">{profile.bio}</p>
      </section>
      <section>
        <h3>サイトの趣旨</h3>
        <p className="whitespace-pre-line break-words">{profile.siteDescription}</p>
      </section>
    </>
  );
}
