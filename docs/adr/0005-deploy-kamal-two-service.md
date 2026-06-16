# ADR-005: Kamal 2 による2サービス同居デプロイ（python_ai はアクセサリ）

- ステータス: Accepted
- 日付: 2026-06-16
- 関連: [ADR-001](0001-deploy-strategy.md), [ADR-003](0003-final-stack.md)（Kamal 2 採用）, [ADR-004](0004-rag-ai-service.md)（python_ai = RAG）

## コンテキスト

本番デプロイ手段は ADR-003 で Kamal 2（VPS）に確定済み。だが本アプリは
**Rails（rails_app）と FastAPI/RAG（python_ai）の2サービス構成**であり、Kamal は本来
「1つのアプリ + アクセサリ群」を前提とするため、2つ目のサービスをどう載せるかを決める必要があった。

検討した案:
1. **python_ai を Kamal アクセサリにする**（同一サーバ同居）
2. python_ai 用に別の `deploy.yml` を用意し、2つの Kamal アプリとして個別管理
3. Fly.io 等で2アプリに分離

## 決定

**案1: python_ai を Kamal アクセサリとして、Rails と同一 VPS に同居させる。**

- Rails = Kamal のメインアプリ（`rails_app/config/deploy.yml` の `servers.web`）
- python_ai = `accessories.python_ai`
- 通信は Kamal の Docker ネットワーク内のコンテナ名 `portfolio-python_ai` で解決
  （`AI_API_URL=http://portfolio-python_ai:8000/api/chat`）
- python_ai はホストにポート公開せず、内部ネットワーク経由で Rails からのみ接続
- SQLite は `portfolio_storage`、FAISS は `portfolio_faiss` ボリュームで永続化

## 結果

### 利点
- 単一 VPS・単一 `deploy.yml` で完結し、個人ポートフォリオ規模に対して運用が最小限。
- サービス間通信が内部ネットワークで閉じ、python_ai を外部公開しなくて済む（攻撃面の縮小）。

### トレードオフ / 注意点
- **Kamal はアクセサリのイメージをビルドしない** → python_ai は事前に `docker build` & `push` が必要
  （手順は [docs/deploy-kamal.md](../deploy-kamal.md)）。Rails のように `kamal deploy` 一発では更新されない。
- 両サービスが同一ホストに同居するため、スケールアウトや障害分離は限定的（規模拡大時は案2/3を再検討）。
- `RAILS_MASTER_KEY` / `GEMINI_API_KEY` / レジストリトークンはシークレットとして環境変数で注入し、
  `.kamal/secrets` には参照のみを記述（値を Git に含めない）。
