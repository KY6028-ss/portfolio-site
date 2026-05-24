# ポートフォリオサイト (Rails 7.1 + Python AI Service)

このプロジェクトは、Ruby on Railsを使用したメインのWebサイトと、Python (FastAPI) を使用したAIチャット機能のマイクロサービス構成です。

## 技術スタック
- **Frontend/Backend:** Ruby on Rails 7.1
- **AI API:** Python 3.10 + FastAPI
- **Database:** SQLite3
- **Styling:** Vanilla CSS (Inline/Internal)
- **Markdown Rendering:** Commonmarker

## セットアップ

### 1. Rails アプリケーション
```bash
cd rails_app
bundle install
bin/rails db:migrate db:seed
bin/rails server
```

### 2. Python AI サービス
```bash
cd python_ai
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## AIチャット機能
プロフィールの詳細ページからAIアシスタントに質問することができます。
Python側の `python_ai/services/rag_service.py` を編集することで、回答ロジックをカスタマイズ可能です。
現在はデモ用のモック回答が返されます。

## ディレクトリ構成
- `rails_app/`: Rails Webアプリケーション
- `python_ai/`: AI機能を提供するAPIサーバー