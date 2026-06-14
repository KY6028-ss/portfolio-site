# ADR-003: 最終スタック確定

- ステータス: Accepted
- 日付: プロジェクト初期

## コンテキスト
[ADR-002](0002-modern-stack-migration.md) の方針を、具体的なライブラリ・インフラ選定まで落とし込む必要があった。

## 決定
以下を確定スタックとする。

### Rails 8（rails_app/）
- Hotwire（Turbo 8 Morphing + Stimulus）
- Tailwind CSS + Propshaft（Node.js 不要）
- Phlex または ViewComponent
- Solid Queue / Solid Cache / Solid Cable（Redis 不要）
- SQLite（本番対応）または PostgreSQL
- Pagy（ページネーション）
- RSpec（テスト）

### デプロイ
- Kamal 2、ホストは VPS（Hetzner CX22）または Fly.io

### Python AI（python_ai/）
- FastAPI + Gemini 2.0 Flash（`google-generativeai` で直呼び出し）

## 結果
- スタックが確定し実装に着手。
- なお Python AI は後に RAG 構成へ拡張された（[ADR-004](0004-rag-ai-service.md) 参照）。
