import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getPublishedPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "サイトやOSS活動に関するお知らせの一覧です。",
};

export default function AnnouncementsPage() {
  return (
    <>
      <h1>お知らせ</h1>
      <PostList posts={getPublishedPosts("announcements")} basePath="/announcements" />
    </>
  );
}
