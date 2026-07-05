# portfolio-site

個人ポートフォリオサイト。プロフィール・実績・技術ブログ・お知らせを公開する。

Rails + Python の2サービス構成から **Next.js (TypeScript) の単一アプリに全面移行**した（経緯: [ADR-006](docs/adr/0006-nextjs-rewrite.md)）。

## 技術スタック

- **フレームワーク:** Next.js（App Router）+ TypeScript
- **スタイリング:** Tailwind CSS v4（デザイントークンは CSS 変数、OS 設定に追従するダークモード対応）
- **コンテンツ:** リポジトリ内の Markdown ファイル（`content/`、DB なし）
- **レンダリング:** 全ページ SSG（静的生成）
- **テスト:** Vitest
- **デプロイ:** Vercel

## 開発コマンド

```bash
npm install        # 依存インストール
npm run dev        # 開発サーバー (http://localhost:3000)
npm run build      # 本番ビルド
npm test           # テスト (Vitest)
npm run lint       # ESLint
```

## ディレクトリ構成

```
content/              # コンテンツ（Markdown + frontmatter）
├── profile.md        # プロフィール（トップページ）
├── blog/             # 技術ブログ記事
├── announcements/    # お知らせ
└── portfolio/        # 実績
src/
├── app/              # ページ（App Router）
├── components/       # Header / Footer / PostList / PortfolioCard / Markdown
└── lib/              # content.ts（ローダー）/ format.ts / site.ts
docs/adr/             # アーキテクチャ決定記録
```

## コンテンツの追加方法

### ブログ記事 / お知らせ

`content/blog/`（または `content/announcements/`）に `スラッグ名.md` を追加する。
ファイル名がそのまま URL になる（例: `content/blog/my-post.md` → `/blogs/my-post`）。

```markdown
---
title: 記事タイトル
publishedAt: "2026-07-05T12:00:00+09:00"
---

本文（Markdown / GFM 対応）
```

- `publishedAt` が **無い**、または**未来日時**の記事は下書き扱いで表示されない
- 公開判定はビルド時に評価されるため、未来日時の記事は日時経過後の**再ビルド（再デプロイ）で公開**される

### 実績

`content/portfolio/` に追加する。`url` / `imageUrl` は省略可。

```markdown
---
title: プロジェクト名
url: https://github.com/example/repo
createdAt: "2026-07-05T12:00:00+09:00"
---

プロジェクトの説明（Markdown）
```

### プロフィール

`content/profile.md` の frontmatter（`name` / `bio` / `siteDescription`）を編集する。

## デプロイ（Vercel）

リポジトリを Vercel にインポートするだけでよい（ルートディレクトリ = リポジトリルート、追加設定不要）。
main ブランチへの push で自動デプロイされる。

## 旧スタックについて

Rails 8 + Python FastAPI（RAG チャット）時代の設計判断は [`docs/adr/`](docs/adr/) に記録している。
AI チャット機能は移行時にスコープ外とした（再実装する場合は Route Handler + Vercel AI SDK 等を想定）。
