import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

type Props = {
  posts: Post[];
  basePath: "/blogs" | "/announcements";
};

export default function PostList({ posts, basePath }: Props) {
  if (posts.length === 0) {
    return <p className="text-muted">記事はまだありません。</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <article key={post.slug} className="border-b border-border-subtle pb-4">
          <time dateTime={post.publishedAt.toISOString()} className="text-muted text-sm">
            {formatDate(post.publishedAt)}
          </time>
          <h2 className="my-1 text-xl">
            <Link
              href={`${basePath}/${post.slug}`}
              className="text-foreground no-underline hover:underline"
            >
              {post.title}
            </Link>
          </h2>
        </article>
      ))}
    </div>
  );
}
