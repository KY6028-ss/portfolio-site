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

export type Profile = {
  name: string;
  bio: string;
  siteDescription: string;
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

export function getProfile(): Profile {
  const file = matter(fs.readFileSync(path.join(contentRoot(), "profile.md"), "utf8"));
  return {
    name: String(file.data.name ?? ""),
    bio: String(file.data.bio ?? "").trim(),
    siteDescription: String(file.data.siteDescription ?? "").trim(),
  };
}
