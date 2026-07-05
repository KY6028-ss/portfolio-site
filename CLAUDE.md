# portfolio-site — CLAUDE.md

このファイルはAIエージェント（Claude）がこのリポジトリで作業する際の参照ドキュメントです。

---

## プロジェクト概要

個人ポートフォリオサイト。**Next.js（App Router）+ TypeScript + Tailwind CSS v4** の単一アプリ。
コンテンツは `content/` 配下の Markdown ファイルで管理し、DB は使わない。全ページ SSG。

2026-07-05 に Rails 8 + Python FastAPI（RAG）の2サービス構成から全面移行した（→ [ADR-006](docs/adr/0006-nextjs-rewrite.md)）。
AI チャット機能は移行時にスコープ外とした。

**リポジトリ:** https://github.com/KY6028-ss/portfolio-site

---

## アーキテクチャ

```
content/                 # コンテンツ（Markdown + frontmatter）— 追加/編集はここだけで完結
├── profile.md           # プロフィール（name / bio / siteDescription、トップページに表示）
├── blog/*.md            # 技術ブログ（title / publishedAt + 本文Markdown）
├── announcements/*.md   # お知らせ（同上）
└── portfolio/*.md       # 実績（title / url? / imageUrl? / createdAt + 本文=説明）
src/
├── app/                 # ルート: / , /blogs(+[slug]), /announcements(+[slug]), /portfolios(+[slug])
├── components/          # Header / Footer / PostList / PortfolioCard / Markdown
└── lib/
    ├── content.ts       # コンテンツローダー（型 + 公開判定。テストは CONTENT_ROOT で差し替え）
    ├── format.ts        # 日付表記（JST固定 YYYY-MM-DD [HH:MM]）/ truncate
    └── site.ts          # サイト名・既定 description
```

### 重要な仕様

- **公開判定（旧 Rails の `published` スコープ相当）:** `publishedAt` が存在し現在時刻以下のときだけ公開。
  無い/未来 = 下書き。ビルド時に評価されるため、未来日時の記事は再デプロイで公開される。
- **slug = ファイル名**（`.md` を除いたもの）。詳細ページは `generateStaticParams` + `dynamicParams = false` で、
  未公開・不明 slug は 404（旧 Rails の挙動と一致）。
- **デザイントークン:** 旧 Rails 版 `application.css` の CSS 変数を `src/app/globals.css` の `@theme inline` に移植。
  色は必ずトークン（`bg-canvas` / `text-foreground` / `text-muted` / `text-accent` / `border-border-default` 等）経由で使う。
  ダークモードは `prefers-color-scheme` で変数を上書きするだけ。

---

## 開発コマンド

```bash
npm run dev        # 開発サーバー (http://localhost:3000)
npm run build      # 本番ビルド（全ルートが Static/SSG になることを確認）
npm test           # Vitest（src/lib/content.test.ts、fixtures は src/lib/__fixtures__/）
npm run lint       # ESLint
```

---

## デプロイ

- **Vercel**（ルートディレクトリ = リポジトリルート、追加設定不要）

---

## 履歴・注意事項

- 旧スタックの設計判断は [`docs/adr/`](docs/adr/)（ADR-001〜005）に記録。ADR-006 が移行の決定記録
- 重要なアーキテクチャ変更をしたら ADR を番号付きで追加すること
- AI チャットを再実装する場合は Next.js Route Handler + Vercel AI SDK 等を想定
  （旧実装の知識ソース形式は git 履歴の `python_ai/data/portfolio_data.md` を参照）
