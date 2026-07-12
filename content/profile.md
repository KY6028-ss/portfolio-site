---
name: shinmori
role: AIエンジニア(肩書きのみ...)
links:
  - label: X
    url: https://x.com/shinmori_dev
  - label: GitHub
    url: https://github.com/KY6028-ss
  - label: Zenn
    url: https://zenn.dev/shinmori_dev
siteDescription: |
  このサイトは、学習の成果や制作したポートフォリオを共有するための場所です。
---

### 自己紹介

2026年からエンジニア職に従事。独学でのプログラミング学習を経てLLMエンジニアとして活動しています。
Claude・Gemini APIを用いたLLM開発を軸に、ファインチューニングからLLMを組み込んだWeb開発まで学習中。
主言語はPython。マイペースに学びを記録・発信しています。

### スキル

- **Python**: 基本文法(ループ・条件分岐)は理解、decorator/type hintsは学習中
- **Ruby**: OSSプロジェクトで基礎文法は都度確認しながら
- **TypeScript**: AIでコードの生成のみ(理解は追いついてない...)
- **LLM関連**: Claude API, Gemini API, RAG実装(Gemini 2.5 Flash使用), LangChain学習中
- **インフラ**: Docker,Git.FastAPI,Vercel（すべて学習中）

### 技術学習ロードマップ(2026年7月〜)
※私のプロンプトからClaudeに設計してもらっています。
#### 目指す姿

顧客との対話にも強く、プロダクトの実装までできるMLエンジニア。
コアはML/データサイエンス、その後プロダクト実装のためのC#/Rustへ。

#### Phase一覧

| Phase | 内容 | 目安時間 | 教材 |
|---|---|---|---|
| **Phase 0(現在)** | **Python基礎の底上げ(型ヒント・デコレータ・OOP・例外処理・pytest) + SQL基礎** | **30〜40h** | **Udemy[「現役シリコンバレーエンジニアが教えるPython 3 入門 + 応用 +アメリカのシリコンバレー流コードスタイル」](https://www.udemy.com/course/python-beginner/)(Python基礎パート)、SQLは[「SQL 第2版 ゼロからはじめるデータベース操作」](https://www.shoeisha.co.jp/book/detail/9784798144450)で自己学習** |
| Phase 1 | SQL(実践) + pandas/numpy(データ抽出・分析) | 50〜60h | SQLは[「SQL 第2版 ゼロからはじめるデータベース操作」](https://www.shoeisha.co.jp/book/detail/9784798144450)継続、pandasは[「豊富な演習問題とKaggle実践で身に付ける！『Python データ分析 & 機械学習 ～パーフェクトスターターコース』」](https://www.udemy.com/course/kagglepython/)検討中 |
| Phase 2 | 統計・線形代数(Phase1と並走) | 20〜30h | [「本当にわかる、AI時代の数学【超初心者からの数学入門】」](https://www.udemy.com/course/ai-math-introduction/)検討中 |
| Phase 3 | 古典的機械学習(scikit-learn) | 60〜80h | [「豊富な演習問題とKaggle実践で身に付ける！『Python データ分析 & 機械学習 ～パーフェクトスターターコース』」](https://www.udemy.com/course/kagglepython/)検討中 |
| Phase 4 | 深層学習の基礎(PyTorch) | 80〜100h | 未定 |
| Phase 5 | LLMエンジニアリングの体系化 | 40〜60h | 未定 |
| Phase 6 | プロダクト実装言語(C#/Rust) | 60〜100h | 未定 |

**合計: 約340〜470時間、週31時間ペースで11〜15週間(約2.5〜3.5ヶ月)**
**現在地: Phase 0(Udemy[「現役シリコンバレーエンジニアが教えるPython 3 入門 + 応用 +アメリカのシリコンバレー流コードスタイル」](https://www.udemy.com/course/python-beginner/)進行中、SQLは[「SQL 第2版 ゼロからはじめるデータベース操作」](https://www.shoeisha.co.jp/book/detail/9784798144450)で並行)**

#### 学習ログの運用

- **平日**: 自己ホストブログにその日の理解を書く(まとまってなくてもOK)→ Claudeにコード・ロジック面を添削してもらう → Geminiに概念・理解面を添削してもらう → 二つの指摘を踏まえて認識のズレを訂正としてまとめる。意見が割れた場合はそのまま明記して保留
- **休日**: 平日ログの中から自信を持って理解できたものだけをZennに技術ナレッジとしてまとめる