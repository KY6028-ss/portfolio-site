import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { getPost, getPublishedPosts } from "@/lib/content";
import { formatDate, truncate } from "@/lib/format";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPosts("announcements").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("announcements", slug);
  if (!post) return {};
  return { title: post.title, description: truncate(post.content, 120) };
}

export default async function AnnouncementPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost("announcements", slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>
        <time dateTime={post.publishedAt.toISOString()} className="text-muted text-sm">
          {formatDate(post.publishedAt, true)}
        </time>
      </p>
      <Markdown>{post.content}</Markdown>
      <Link href="/announcements">一覧に戻る</Link>
    </article>
  );
}
