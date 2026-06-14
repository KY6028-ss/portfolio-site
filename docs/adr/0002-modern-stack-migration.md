# ADR-002: モダンスタック移行

- ステータス: Accepted
- 日付: プロジェクト初期

## コンテキスト
Rails のモダンな機能とAIチャット機能を取り入れ、保守しやすい構成にしたい。

## 決定
Rails 8 + Hotwire（Turbo / Stimulus）をフロントエンドの中心とし、AIチャットには Gemini を採用する。

## 結果
- SPA に近い体験を Node.js 依存なしで実現。
- AI機能の方向性が確定し、[ADR-003](0003-final-stack.md) で詳細スタックを固めた。
