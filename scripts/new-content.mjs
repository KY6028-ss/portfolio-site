// content/ 配下に記事の雛形を作成し、実行時点の時刻を frontmatter に記録する
// 使い方: node scripts/new-content.mjs <blog|announcements|portfolio> "タイトル" [slug]
import fs from "node:fs";
import path from "node:path";

const TYPES = ["blog", "announcements", "portfolio"];

const [type, title, slugArg] = process.argv.slice(2);

if (!TYPES.includes(type) || !title?.trim()) {
  console.error('使い方: node scripts/new-content.mjs <blog|announcements|portfolio> "タイトル" [slug]');
  console.error('例:     npm run new:blog -- "新しい記事のタイトル" my-slug');
  process.exit(1);
}

// 既存コンテンツの書式 "YYYY-MM-DDTHH:MM:SS+09:00" に揃える（sv-SE は YYYY-MM-DD HH:MM:SS を返す）
function jstTimestamp(date) {
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  return formatted.replace(" ", "T") + "+09:00";
}

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const now = new Date();
const timestamp = jstTimestamp(now);
// 日本語タイトル等で slug が空になる場合は日時ベースにフォールバック
const fallbackSlug = `${type}-${timestamp.slice(0, 16).replace(/[-T:]/g, "").slice(0, 12)}`;
const slug = toSlug(slugArg ?? title) || fallbackSlug;

const escapedTitle = title.trim().replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const frontmatter =
  type === "portfolio"
    ? [
        "---",
        `title: "${escapedTitle}"`,
        '# url: "https://example.com" # 公開URLがあればコメントを外して記入',
        `createdAt: "${timestamp}"`,
        "---",
      ]
    : ["---", `title: "${escapedTitle}"`, `publishedAt: "${timestamp}"`, "---"];

const body = [...frontmatter, "", "ここに本文を書く", ""].join("\n");

const filePath = path.join(process.cwd(), "content", type, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`既に存在します: ${filePath}`);
  console.error("別の slug を第3引数で指定してください。");
  process.exit(1);
}

fs.writeFileSync(filePath, body, "utf8");
console.log(`作成しました: ${filePath}`);
console.log(`時刻を記録: ${timestamp}`);
