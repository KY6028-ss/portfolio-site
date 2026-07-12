import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostType = "blog" | "announcements";

export type Post = {
  slug: string;
  title: string;
  publishedAt: Date;
  content: string;
};

export type PortfolioItem = {
  slug: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  createdAt: Date;
};

export type ProfileLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  role?: string;
  links: ProfileLink[];
  siteDescription: string;
  body: string;
};

// テストからは CONTENT_ROOT でフィクスチャに差し替えられる
function contentRoot(): string {
  return process.env.CONTENT_ROOT ?? path.join(process.cwd(), "content");
}

// gray-matter(js-yaml) はクォート無しの日時を Date に解釈することがあるため両対応
function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function readMarkdownFiles(dir: string): { slug: string; file: matter.GrayMatterFile<string> }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => ({
      slug: name.replace(/\.md$/, ""),
      file: matter(fs.readFileSync(path.join(dir, name), "utf8")),
    }));
}

function toPost(slug: string, file: matter.GrayMatterFile<string>): Post | null {
  // publishedAt が無い/未来 = 未公開（下書き）。Rails の published スコープと同じ扱い
  const publishedAt = toDate(file.data.publishedAt);
  if (!publishedAt || publishedAt.getTime() > Date.now()) return null;
  return {
    slug,
    title: String(file.data.title ?? ""),
    publishedAt,
    content: file.content.trim(),
  };
}

export function getPublishedPosts(type: PostType): Post[] {
  return readMarkdownFiles(path.join(contentRoot(), type))
    .map(({ slug, file }) => toPost(slug, file))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function getPost(type: PostType, slug: string): Post | null {
  const filePath = path.join(contentRoot(), type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return toPost(slug, matter(fs.readFileSync(filePath, "utf8")));
}

function toPortfolioItem(slug: string, file: matter.GrayMatterFile<string>): PortfolioItem {
  return {
    slug,
    title: String(file.data.title ?? ""),
    description: file.content.trim(),
    url: file.data.url ? String(file.data.url) : undefined,
    imageUrl: file.data.imageUrl ? String(file.data.imageUrl) : undefined,
    createdAt: toDate(file.data.createdAt) ?? new Date(0),
  };
}

export function getPortfolios(): PortfolioItem[] {
  return readMarkdownFiles(path.join(contentRoot(), "portfolio"))
    .map(({ slug, file }) => toPortfolioItem(slug, file))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getPortfolio(slug: string): PortfolioItem | null {
  const filePath = path.join(contentRoot(), "portfolio", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return toPortfolioItem(slug, matter(fs.readFileSync(filePath, "utf8")));
}

export type RecentUpdate = {
  title: string;
  href: string;
  label: "Blog" | "News" | "Portfolio";
  date: Date;
};

// 全コンテンツ（ブログ・お知らせ・実績）を公開/作成日時の新しい順に統合した一覧（サイドバー表示用）
export function getRecentUpdates(limit = 10): RecentUpdate[] {
  const now = Date.now();
  const updates: RecentUpdate[] = [
    ...getPublishedPosts("blog").map((p) => ({
      title: p.title,
      href: `/blogs/${p.slug}`,
      label: "Blog" as const,
      date: p.publishedAt,
    })),
    ...getPublishedPosts("announcements").map((p) => ({
      title: p.title,
      href: `/announcements/${p.slug}`,
      label: "News" as const,
      date: p.publishedAt,
    })),
    ...getPortfolios()
      // createdAt 無し(epoch 0)・未来日時の実績は載せない（公開判定に相当）
      .filter((p) => p.createdAt.getTime() > 0 && p.createdAt.getTime() <= now)
      .map((p) => ({
        title: p.title,
        href: `/portfolios/${p.slug}`,
        label: "Portfolio" as const,
        date: p.createdAt,
      })),
  ];
  return updates.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}

// 全コンテンツの最新公開/作成日時（ヘッダーの「最終更新」表示用）。コンテンツが無ければ null
export function getLatestContentUpdate(): Date | null {
  return getRecentUpdates(1)[0]?.date ?? null;
}

function toLinks(value: unknown): ProfileLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { label: unknown; url: unknown } => typeof item === "object" && item !== null)
    .filter((item) => item.label && item.url)
    .map((item) => ({ label: String(item.label), url: String(item.url) }));
}

export function getProfile(): Profile {
  const file = matter(fs.readFileSync(path.join(contentRoot(), "profile.md"), "utf8"));
  return {
    name: String(file.data.name ?? ""),
    role: file.data.role ? String(file.data.role) : undefined,
    links: toLinks(file.data.links),
    siteDescription: String(file.data.siteDescription ?? "").trim(),
    body: file.content.trim(),
  };
}
