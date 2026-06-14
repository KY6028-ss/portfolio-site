# ADR-004: AIサービスを RAG 構成に拡張

- ステータス: Accepted
- 日付: 2026-06-14
- 関連: [ADR-003](0003-final-stack.md) を一部更新

## コンテキスト

[ADR-003](0003-final-stack.md) では Python AI を「FastAPI + Gemini 2.0 Flash の直呼び出し」と定義していた。
しかし直呼び出し方式では以下の課題があった。

- ポートフォリオ・経歴・スキルなどオーナー固有の情報をモデルが知らず、回答が一般論に終始する。
- システムプロンプトに情報を全文埋め込む方式はトークン効率が悪く、情報が増えるとスケールしない。

実装はすでに RAG（Retrieval-Augmented Generation）構成へ進化しており、本 ADR でその構成を正式な決定として記録する。

## 決定

Python AI を **RAG パイプライン**として構成する。

| 項目 | 採用技術 |
|------|---------|
| フレームワーク | FastAPI |
| オーケストレーション | LangChain 1.x（LCEL: LangChain Expression Language） |
| LLM | **Gemini 2.5 Flash**（`langchain-google-genai` の `ChatGoogleGenerativeAI`） |
| 埋め込み | `gemini-embedding-001`（`GoogleGenerativeAIEmbeddings`） |
| ベクトルストア | FAISS（`faiss-cpu`、ローカル永続化） |
| 知識ソース | `python_ai/data/portfolio_data.md` |
| インデックス | `python_ai/faiss_index/`（初回起動時に生成・永続化） |

### パイプライン（`python_ai/services/rag_service.py`）
1. 起動時に `portfolio_data.md` を読み込み、埋め込み化して FAISS インデックスを生成（既存インデックスがあればロード）。
2. リクエストごとに retriever（`k=3`）で関連チャンクを取得。
3. LCEL チェーン `{context, input} | prompt | llm | StrOutputParser` で回答生成。

### エンドポイント（`python_ai/app/main.py`）
- `POST /api/chat` — `{ "message": str }` を受け取り `{ "reply": str }` を返す。
- `GET /health` — `RAGService.is_ready` に連動し `{"status": "ready" | "initializing"}` を返す（Docker healthcheck 用）。

### 起動安全性
- `GEMINI_API_KEY` 未設定・無効時は RAG を初期化せず、`generate_reply` は調整中メッセージを返す（クラッシュさせない）。

## ADR-003 からの変更点
- モデル: `gemini-2.0-flash`（直呼び出し）→ **`gemini-2.5-flash`（RAG 経由）**
- 依存: `google-generativeai` → `langchain` / `langchain-google-genai` / `langchain-community` / `faiss-cpu`
- `/health` を `is_ready` 連動で実装済み（ADR-003 時点では未実装）

## 結果

### 利点
- オーナー固有情報に基づいた回答が可能。
- 知識ソースは Markdown を編集してインデックスを再生成するだけで更新でき、保守が容易。
- インデックス永続化により再起動が高速。

### トレードオフ / 注意点
- 依存関係が増え、初回ビルド・初回起動（埋め込み生成）に時間がかかる。
- `faiss_index/` と `data/` は成果物・知識ソースであり、Git 管理方針を別途定める必要がある（インデックスは再生成可能なため `.gitignore` 候補）。
- `FAISS.load_local` は `allow_dangerous_deserialization=True` を使用しており、信頼できるインデックスのみロードすること。
- `portfolio_data.md` 更新後はインデックスの再生成（`faiss_index/` 削除 or 再ビルド）が必要。

## 今後の検討（Phase 3 と整合）
- Gemini Tool Use によるポートフォリオ/ブログの動的検索ツール化。
- チャット履歴の永続化（`conversations` テーブル）。
