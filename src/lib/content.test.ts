import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  getPost,
  getPortfolio,
  getPortfolios,
  getProfile,
  getPublishedPosts,
} from "./content";
import { formatDate, truncate } from "./format";

const fixtureRoot = path.join(__dirname, "__fixtures__", "content");
let originalContentRoot: string | undefined;

beforeAll(() => {
  originalContentRoot = process.env.CONTENT_ROOT;
  process.env.CONTENT_ROOT = fixtureRoot;
});

afterAll(() => {
  if (originalContentRoot === undefined) {
    delete process.env.CONTENT_ROOT;
  } else {
    process.env.CONTENT_ROOT = originalContentRoot;
  }
});

describe("getPublishedPosts", () => {
  it("公開済みの記事だけを新しい順で返す", () => {
    const posts = getPublishedPosts("blog");
    expect(posts.map((p) => p.slug)).toEqual(["newer-post", "older-post"]);
  });

  it("未来日付の記事は含まない", () => {
    const slugs = getPublishedPosts("blog").map((p) => p.slug);
    expect(slugs).not.toContain("future-post");
  });

  it("publishedAt が無い記事（下書き）は含まない", () => {
    const slugs = getPublishedPosts("blog").map((p) => p.slug);
    expect(slugs).not.toContain("draft-post");
  });

  it("announcements も読める", () => {
    const posts = getPublishedPosts("announcements");
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("お知らせテスト");
  });
});

describe("getPost", () => {
  it("公開済み記事を slug で取得できる", () => {
    const post = getPost("blog", "older-post");
    expect(post?.title).toBe("古い記事");
    expect(post?.content).toBe("古い本文");
  });

  it("未来日付の記事は null", () => {
    expect(getPost("blog", "future-post")).toBeNull();
  });

  it("下書き記事は null", () => {
    expect(getPost("blog", "draft-post")).toBeNull();
  });

  it("存在しない slug は null", () => {
    expect(getPost("blog", "no-such-post")).toBeNull();
  });
});

describe("getPortfolios", () => {
  it("createdAt の新しい順で返す", () => {
    const items = getPortfolios();
    expect(items.map((i) => i.slug)).toEqual(["second-work", "first-work"]);
  });

  it("url は省略可能", () => {
    expect(getPortfolio("second-work")?.url).toBeUndefined();
    expect(getPortfolio("first-work")?.url).toBe("https://example.com/first");
  });

  it("存在しない slug は null", () => {
    expect(getPortfolio("no-such-work")).toBeNull();
  });
});

describe("getProfile", () => {
  it("frontmatter からプロフィールを読む", () => {
    const profile = getProfile();
    expect(profile.name).toBe("テスト 太郎");
    expect(profile.bio).toBe("一行目\n二行目");
    expect(profile.siteDescription).toBe("テスト用の説明");
  });
});

describe("formatDate", () => {
  const date = new Date("2020-05-01T09:30:00+09:00");

  it("JST の YYYY-MM-DD を返す", () => {
    expect(formatDate(date)).toBe("2020-05-01");
  });

  it("withTime で時刻付きになる", () => {
    expect(formatDate(date, true)).toBe("2020-05-01 09:30");
  });
});

describe("truncate", () => {
  it("length を超えたら省略記号込みで切り詰める", () => {
    expect(truncate("あいうえおかきくけこ", 5)).toBe("あいうえ…");
  });

  it("length 以下ならそのまま返す", () => {
    expect(truncate("短い", 5)).toBe("短い");
  });
});
