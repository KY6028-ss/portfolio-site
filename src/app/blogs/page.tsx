import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getPublishedPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "技術ブログ",
  description: "日々の学習記録・技術的な気づき・OSS活動の進捗を発信しています。",
};

export default function BlogsPage() {
  return (
    <>
      <h1>技術ブログ</h1>
      <PostList posts={getPublishedPosts("blog")} basePath="/blogs" />
    </>
  );
}
