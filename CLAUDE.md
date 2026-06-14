# portfolio-site — CLAUDE.md

このファイルはAIエージェント（Claude）がこのリポジトリで作業する際の参照ドキュメントです。

---

## プロジェクト概要

個人ポートフォリオサイト。Rails 8 モノリス + Python AI（**RAG / Gemini 2.5 Flash**）の2サービス構成。
訪問者はプロフィール・実績・技術ブログを閲覧でき、オーナー情報に基づく RAG ベースのAIチャットで質問もできる。

**リポジトリ:** https://github.com/KY6028-ss/portfolio-site

---

## アーキテクチャ

```
portfolio-site/
├── rails_app/        # Rails 8 本体（Web UI + DB）
└── python_ai/        # FastAPI + RAG（LangChain + FAISS + Gemini）AIチャットサービス
```

### サービス構成（docker-compose.yml）

| サービス    | ポート | 役割                        |
|------------|--------|----------------------------|
| rails_app  | 3000   | メインWebアプリ              |
| python_ai  | 8000   | AIチャットAPI（RAG / Gemini連携） |

Rails → Python AI の通信は `AI_API_URL=http://python_ai:8000/api/chat` 経由。

---

## 技術スタック（確定 ADR-003）

### Rails 8（rails_app/）
- **Ruby:** `.ruby-version` 参照
- **フレームワーク:** Rails 8
- **フロントエンド:** Hotwire（Turbo 8 + Morphing）、Stimulus
- **CSS:** Tailwind CSS（Node.js不要のスタンドアロンビルド）
- **アセット:** Propshaft（`--asset-pipeline=propshaft` で生成）
- **UIコンポーネント:** Phlex または ViewComponent
- **非同期処理:** Solid Queue（Redis不要）
- **キャッシュ:** Solid Cache（Redis不要）
- **WebSocket:** Solid Cable（Redis不要）
- **DB:** SQLite（開発・本番） または PostgreSQL
- **ページネーション:** Pagy
- **テスト:** RSpec

### Python AI（python_ai/）— RAG 構成（→ [ADR-004](docs/adr/0004-rag-ai-service.md)）
- **フレームワーク:** FastAPI
- **オーケストレーション:** LangChain 1.x（LCEL）
- **AIモデル:** Gemini 2.5 Flash（`langchain-google-genai`）
- **埋め込み:** `gemini-embedding-001`
- **ベクトルストア:** FAISS（`faiss-cpu`、`python_ai/faiss_index/` に永続化）
- **知識ソース:** `python_ai/data/portfolio_data.md`
- **環境変数:** `python_ai/.env` に `GEMINI_API_KEY` を設定

### デプロイ（目標）
- **ツール:** Kamal 2
- **ホスト:** VPS（Hetzner CX22 推奨）または Fly.io

---

## ディレクトリ構造（rails_app/）

```
rails_app/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── announcements_controller.rb
│   │   ├── blogs_controller.rb
│   │   ├── portfolios_controller.rb
│   │   └── profiles_controller.rb
│   ├── models/
│   │   ├── announcement.rb    # scope: published, recent
│   │   ├── blog.rb            # scope: published, recent
│   │   ├── portfolio.rb       # scope: recent
│   │   └── profile.rb         # Profile.current でシングルトン取得
│   └── views/
│       ├── announcements/
│       ├── blogs/
│       ├── portfolios/
│       └── profiles/
├── config/
│   └── routes.rb
├── db/migrate/
│   ├── ..._create_portfolios.rb
│   └── ..._create_blogs.rb
└── spec/
    ├── models/
    └── requests/
```

---

## バグ修正状況

### ✅ 修正済み（2026-06-14）

1. **`published_at` nil クラッシュ** — `announcements`/`blogs` の index・show ビューを `published_at&.strftime(...)` の nil ガードに修正。
   - 補足: `published` スコープ（`published_at <= now`）が nil を「未公開（下書き）」として扱うため、presence バリデーションは**あえて付けない**（下書き運用を維持）。ガードは多層防御。
   - テスト: `spec/views/blogs/index_spec.rb`
2. **`Profile.current` の非決定的挙動** — `order(:id).first` に修正（`app/models/profile.rb`）。テスト: `spec/models/profile_spec.rb`
3. **ページネーション** — Pagy 導入。`announcements` / `blogs` / `portfolios` の index に適用（1ページ10件）。テスト: `spec/requests/blogs_spec.rb`
4. **Python AI ヘルスチェック** — `GET /health` を `RAGService.is_ready` 連動で実装済み（`python_ai/app/main.py`）。

### 🟡 残課題

5. **`generate_files.py` でコード管理** — Pythonの文字列としてRailsコードを管理しており保守困難。本番コードは個別ファイルをGitで直接管理すること（参照専用）。
6. **Docker healthcheck の設定** — `/health` は実装済みだが、`docker-compose.yml` への healthcheck 定義は未設定。

---

## Python AI セットアップ

### 環境変数（python_ai/.env）

```bash
GEMINI_API_KEY=your_key_here
# 取得先: https://aistudio.google.com/apikey
```

### 構成（RAG）

実装は **RAG パイプライン**。詳細は [ADR-004](docs/adr/0004-rag-ai-service.md)。

- `python_ai/app/main.py` — FastAPI。`POST /api/chat` と `GET /health`（`is_ready` 連動）。
- `python_ai/services/rag_service.py` — LangChain LCEL チェーン（retriever → prompt → Gemini 2.5 Flash → StrOutputParser）。
- `python_ai/data/portfolio_data.md` — 知識ソース（編集したら `faiss_index/` を再生成）。
- `GEMINI_API_KEY` 未設定時は RAG を初期化せず、調整中メッセージを返す（クラッシュしない）。

### requirements.txt（抜粋）

```
fastapi>=0.136.0
uvicorn>=0.35.0
langchain==1.3.7
langchain-google-genai>=2.0.0
langchain-community>=0.4.0
faiss-cpu>=1.9.0
python-dotenv>=1.0.1
```

---

## 開発コマンド

```bash
# 全サービス起動
docker compose up

# Railsのみ
cd rails_app && bundle exec rails server

# Python AIのみ
cd python_ai && uvicorn app.main:app --reload

# テスト実行
cd rails_app && bundle exec rspec

# DBマイグレーション
cd rails_app && bundle exec rails db:migrate
```

---

## 今後のロードマップ

### Phase 1 — バグ修正・公開（優先）
- [x] `published_at` nil バグ修正
- [x] `Profile.current` に `order(:id)` 追加
- [x] `/health` エンドポイント追加
- [x] `main.py` を Gemini（RAG）に書き換え（→ [ADR-004](docs/adr/0004-rag-ai-service.md)）
- [x] Pagy でページネーション実装（Phase 2 から前倒し）
- [ ] `docker-compose.yml` に healthcheck 定義を追加
- [ ] Kamal 2 / Fly.io でデプロイ

### Phase 2 — Rails 8 モダン化
- [ ] Propshaft + Tailwind CSS 導入
- [ ] Solid Queue / Cache / Cable 設定
- [x] Pagy でページネーション実装
- [ ] Phlex でUIコンポーネント化
- [ ] Turbo Streams でチャットをリアルタイム化

### Phase 3 — AIエージェント強化
- [ ] Gemini Tool Use でポートフォリオ/ブログ検索ツールを実装
- [ ] チャット履歴の永続化（`conversations` テーブル）
- [ ] GitHub Actions + Kamal 2 で CI/CD 自動化

---

## ADR（アーキテクチャ決定記録）サマリー

詳細は [`docs/adr/`](docs/adr/) を参照。

| ADR | タイトル | 決定 |
|-----|---------|------|
| [ADR-001](docs/adr/0001-deploy-strategy.md) | デプロイ戦略 | Rails + Fly.io（Kamal 2へ移行予定） |
| [ADR-002](docs/adr/0002-modern-stack-migration.md) | モダンスタック移行 | Rails 8 + Hotwire + Gemini AI |
| [ADR-003](docs/adr/0003-final-stack.md) | 最終スタック確定 | Solid三兄弟 + Kamal 2 + Gemini 2.0 Flash |
| [ADR-004](docs/adr/0004-rag-ai-service.md) | AIサービスを RAG 構成に拡張 | LangChain + FAISS + Gemini 2.5 Flash |

---

## 注意事項

- `python_ai/.env` は `.gitignore` に含まれていること（APIキー漏洩防止）
- `generate_files.py` / `generate_ai_files.py` はスキャフォールド用スクリプトであり、本番コードではない
- テスト環境: `spec/rails_helper.rb` は実 Rails 環境を読み込む構成（`rspec-rails` 8）。ホストの Ruby は 3.0 のため、テストは Docker 上（Ruby 3.2+）で `bundle exec rspec` 実行すること
- `python_ai/faiss_index/`・`python_ai/data/` の Git 管理方針: インデックスは再生成可能なため `.gitignore` 候補。知識ソース（`portfolio_data.md`）は管理対象
