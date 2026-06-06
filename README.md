# ポートフォリオサイト (Rails 7.1 + Python AI Service)

このプロジェクトは、Ruby on Railsを使用したメインのWebサイトと、Python (FastAPI) を使用したAIチャット機能のマイクロサービス構成です。

## 技術スタック
- **Frontend/Backend:** Ruby on Rails 7.1
- **AI API:** Python 3.10 + FastAPI
- **Database:** SQLite3
- **Styling:** Vanilla CSS (Inline/Internal)
- **Markdown Rendering:** Commonmarker

## セットアップ

### 1. Rails アプリケーション & Python AI サービス　起動
```bash(ルートディレクトリ)
アプリをgemやpipのインストールから起動する（一番基本）:
docker compose up --build -d

アプリをgemのインストールから起動する（Railsのみ）:
docker-compose up --build -d rails

アプリをpipのインストールから起動する（Pythonのみ）:
docker-compose up --build -d python

アプリを起動する(ライブラリのインストールなし)
docker compose up -d
```
### 1. Rails アプリケーション & Python AI サービス　停止
```bash(ルートディレクトリ)
アプリを安全に停止する（一番基本）:
docker compose down

データ（データベースなど）も含めて完全にリセットしたい場合:
docker compose down -v

停止したかどうかの確認コマンド:
docker compose ps
```

## AIチャット機能
プロフィールの詳細ページからAIアシスタントに質問することができます。
Python側の `python_ai/services/rag_service.py` を編集することで、回答ロジックをカスタマイズ可能です。
現在はデモ用のモック回答が返されます。

## ディレクトリ構成
- `rails_app/`: Rails Webアプリケーション
- `python_ai/`: AI機能を提供するAPIサーバー