# デプロイ手順（Kamal 2 / VPS）

portfolio-site を Kamal 2 で VPS にデプロイする手順です。
**メインアプリ（Rails）= Kamal アプリ**、**python_ai（RAG API）= Kamal アクセサリ**として同一サーバに同居させます。
設定の本体は [`rails_app/config/deploy.yml`](../rails_app/config/deploy.yml)、決定の背景は [ADR-005](adr/0005-deploy-kamal-two-service.md)。

---

## 前提（ご自身で用意するもの）

| 項目 | 内容 |
|------|------|
| VPS | Ubuntu などの Linux サーバ（例: Hetzner CX22）。SSH 鍵でログインできること |
| ドメイン | A レコードで VPS の IP を指すドメイン（HTTPS 自動取得に必要） |
| コンテナレジストリ | Docker Hub 等。`<REGISTRY_USER>` とアクセストークン |
| `RAILS_MASTER_KEY` | `rails_app/config/master.key` の中身（無ければ後述で生成） |
| `GEMINI_API_KEY` | python_ai が使う Gemini APIキー |
| 手元の環境 | Docker と Ruby（`bundle exec kamal`）。Ruby が無ければ Docker 版 kamal でも可 |

> ⚠️ 現在 `config/master.key` がリポジトリ内に存在しません。手元に保管しているキーを
> `rails_app/config/master.key` に置くか、無い場合は新規生成（次項）してください。

---

## 0. プレースホルダの置換

`rails_app/config/deploy.yml` の以下を実値に置き換えます。

- `<REGISTRY_USER>` … レジストリのユーザー名
- `<SERVER_IP>` … VPS の IP（`servers.web` と `accessories.python_ai.host` の2箇所）
- `<YOUR_DOMAIN>` … 公開ドメイン

## 1. master.key の用意（無い場合のみ）

```bash
cd rails_app
EDITOR=vi bin/rails credentials:edit   # 保存すると config/master.key が生成される
```

## 2. シークレットを環境変数で用意

```bash
export KAMAL_REGISTRY_PASSWORD=<レジストリのアクセストークン>
export GEMINI_API_KEY=<Gemini APIキー>
# RAILS_MASTER_KEY は .kamal/secrets が config/master.key から自動取得
```

## 3. python_ai のイメージを build & push（重要）

Kamal はアクセサリのイメージをビルドしないため、**先に手動で push** します。
（`data/portfolio_data.md` は実データに差し替えておくこと。テンプレートは `portfolio_data.example.md`。）

```bash
# リポジトリのルートで
docker build --platform linux/amd64 -t <REGISTRY_USER>/portfolio-ai:latest ./python_ai
docker push <REGISTRY_USER>/portfolio-ai:latest
```

## 4. 初回セットアップ（サーバへ Docker 等を導入し初回デプロイ）

```bash
cd rails_app
bundle exec kamal setup
```

`bundle exec` が使えない環境では Docker 版 kamal でも可:

```bash
cd rails_app
docker run --rm -it -v "$PWD:/workdir" -v /var/run/docker.sock:/var/run/docker.sock \
  -e KAMAL_REGISTRY_PASSWORD -e GEMINI_API_KEY \
  ghcr.io/basecamp/kamal:latest setup
```

## 5. 2 回目以降のデプロイ

```bash
cd rails_app
bundle exec kamal deploy
```

python_ai を更新したときは、再 push してからアクセサリを再起動:

```bash
docker build --platform linux/amd64 -t <REGISTRY_USER>/portfolio-ai:latest ./python_ai
docker push <REGISTRY_USER>/portfolio-ai:latest
cd rails_app && bundle exec kamal accessory reboot python_ai
```

---

## 動作確認

```bash
cd rails_app
bundle exec kamal app logs -f            # Rails ログ
bundle exec kamal accessory logs python_ai -f   # python_ai ログ
```

- `https://<YOUR_DOMAIN>/up` が 200（Rails ヘルス）
- Rails → python_ai は `http://portfolio-python_ai:8000/api/chat`（kamal ネットワーク内）で疎通
- python_ai のヘルスは内部の `/health`（`{"status":"ready"}`）

## 補足・注意

- **SQLite の永続化**: `volumes: portfolio_storage:/rails/storage` で primary/cache/queue/cable の DB を永続化。サーバ移設時はこのボリュームを移すこと。
- **FAISS**: `portfolio_faiss` ボリュームに永続化。`portfolio_data.md` を更新したら、再 push 後にボリュームを作り直すかインデックスを削除して再生成。
- **python_ai は非公開**: ホストにポート公開せず、kamal ネットワーク経由で Rails からのみアクセス。
- **シークレットを Git に含めない**: `.kamal/secrets` は参照のみ。実値は環境変数で渡す。
