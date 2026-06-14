# portfolio-site

個人ポートフォリオサイト。**Rails 8 モノリス**（Web UI + DB）と **Python AI サービス**（RAG / Gemini 2.5 Flash）の2サービス構成です。
訪問者はプロフィール・実績・技術ブログを閲覧でき、オーナー情報に基づく AI チャットに質問できます。

> AI エージェント（Claude）向けの詳細な作業ガイドは [`CLAUDE.md`](CLAUDE.md)、アーキテクチャ決定は [`docs/adr/`](docs/adr/) を参照してください。

## 技術スタック

| レイヤー | 採用技術 |
|---------|---------|
| Web | Ruby on Rails 8.1（Ruby 4.0.5） |
| フロントエンド | Hotwire（Turbo / Stimulus）、ERB ビュー |
| ページネーション | Pagy |
| Markdown | Commonmarker |
| DB | SQLite3 |
| AI サービス | Python 3.14 + FastAPI |
| RAG | LangChain（LCEL）+ FAISS + Gemini 2.5 Flash（`langchain-google-genai`） |
| テスト | RSpec |
| 実行環境 | Docker Compose |

## ディレクトリ構成

```
portfolio-site/
├── rails_app/        # Rails 8 本体（Web UI + DB）
├── python_ai/        # FastAPI + RAG（LangChain + FAISS + Gemini）
│   ├── app/main.py            # POST /api/chat, GET /health
│   ├── services/rag_service.py# RAG パイプライン（LCEL）
│   └── data/portfolio_data.md # 知識ソース（編集対象）
├── docs/adr/         # アーキテクチャ決定記録（ADR）
└── docker-compose.yml
```

| サービス | ポート | 役割 |
|---------|--------|------|
| `rails_app` | 3000 | メイン Web アプリ |
| `python_ai` | 8000 | AI チャット API（RAG / Gemini） |

Rails → Python AI の通信は `AI_API_URL=http://python_ai:8000/api/chat` 経由です。

## セットアップ

### 1. AI 用の API キーを設定

`python_ai/.env` を作成し、Gemini の API キーを設定します（`.env` は `.gitignore` 済み）。

```bash
# python_ai/.env
GEMINI_API_KEY=your_key_here
# 取得先: https://aistudio.google.com/apikey
```

> キー未設定でも起動はします（AI が「調整中」メッセージを返す縮退モード）。

### 2. 起動（ルートディレクトリで実行）

```bash
# 依存（gem / pip）のインストールから起動（基本）
docker compose up --build -d

# ライブラリ再インストールなしで起動
docker compose up -d

# 個別サービスのみビルド起動
docker compose up --build -d rails_app
docker compose up --build -d python_ai
```

- Web: http://localhost:3000
- AI API: http://localhost:8000

`rails_app` は `python_ai` が healthy になってから起動します（`depends_on: condition: service_healthy`）。

### 3. 停止・確認

```bash
docker compose down        # 停止
docker compose down -v      # DB 等も含め完全リセット
docker compose ps           # 状態確認（healthy 表示）
docker compose restart rails_app   # 再起動
docker compose restart python_ai
```

## ヘルスチェック

| エンドポイント | サービス | 内容 |
|--------------|---------|------|
| `GET /up` | rails_app | Rails 標準ヘルス（200 で healthy） |
| `GET /health` | python_ai | `{"status": "ready" \| "initializing"}`（RAG 初期化状態に連動） |

両サービスとも `docker-compose.yml` の healthcheck に組み込み済みです。

## テスト（RSpec）

ホストの Ruby ではなく Docker 上（Ruby 4.0.5）で実行します。

```bash
docker compose run --rm --no-deps -e RAILS_ENV=test rails_app \
  bash -c "bin/rails db:test:prepare && bundle exec rspec"
```

## AI チャット機能

プロフィール詳細ページから AI アシスタントに質問できます。回答は **RAG パイプライン**で生成されます:

1. `python_ai/data/portfolio_data.md`（オーナー情報）を埋め込み、FAISS インデックス（`python_ai/faiss_index/`）として永続化
2. 質問に意味的に近いチャンクを検索し、Gemini 2.5 Flash に渡して回答を生成

回答ロジックは `python_ai/services/rag_service.py` で、知識は `portfolio_data.md` を編集してカスタマイズできます。

> `portfolio_data.md` を更新したら、`python_ai/faiss_index/` を削除して再生成してください（古い内容が検索され続けるのを防ぐため）。
