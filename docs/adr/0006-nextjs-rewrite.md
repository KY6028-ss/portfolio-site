# ADR-006: Next.js (TypeScript) への全面書き直し

- ステータス: Accepted
- 日付: 2026-07-05

## コンテキスト

サイトは Rails 8 モノリス + Python FastAPI（RAG チャット）の2サービス構成だった（[ADR-003](0003-final-stack.md) / [ADR-004](0004-rag-ai-service.md)）。
TypeScript を軸にしたスタックへ移行したいという要望に加え、以下の実態があった。

- コンテンツは DB（SQLite）管理だが管理画面はなく、内容はシードデータ相当のみ
- クライアントサイド JS はほぼゼロ（Hotwire は宣言のみで未使用）
- デプロイ（Kamal 2）は未実施のままだった

## 決定

- **Next.js（App Router）+ TypeScript + Tailwind CSS v4** に全面書き直し
- コンテンツは **リポジトリ内の Markdown ファイル**（`content/`、frontmatter 付き）で管理し、DB を廃止
- 全ページ **SSG**（`published` 相当のフィルタはビルド時に評価）
- **AI チャット機能は一旦スコープ外**とし、`python_ai/` ごと削除（将来は Next.js の Route Handler + Vercel AI SDK 等で再実装できる）
- デプロイ先は **Vercel**（Kamal 2 構成は廃止）
- `rails_app/`・`docker-compose.yml`・スキャフォールド用スクリプト群を削除

## 結果

- リポジトリはルート直下の単一 Next.js アプリになった
- 旧デザインは CSS 変数トークンごと Tailwind の `@theme` に移植（ダークモード含む）
- コンテンツの追加は Markdown ファイルの追加のみで完結し、Git で履歴管理できる
- 旧スタック（ADR-001〜005 の対象）はこの ADR をもって廃止。経緯の記録として ADR は残す
