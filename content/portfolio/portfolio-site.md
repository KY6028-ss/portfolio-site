---
title: ポートフォリオサイト(本サイト)
url: https://github.com/KY6028-ss/portfolio-site
createdAt: "2026-07-05T12:00:00+09:00"
---

このサイト自体が制作物です。

当初は Rails + FastAPI の2サービス構成で、Gemini 2.5 Flash による RAG パイプライン(LangChain + FAISS)を組み込み、
自宅の Raspberry Pi 5 + Cloudflare Tunnel でセルフホスティングする構成として開発しました。

その後、Next.js + TypeScript の単一アプリに全面書き直し、現在は Vercel でホスティングしています。
コンテンツはリポジトリ内の Markdown で管理し、全ページを静的生成(SSG)しています。
