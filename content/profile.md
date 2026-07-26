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
- **インフラ**: Docker,Git,FastAPI,Vercel（すべて今後学習予定、一旦後回し...）
- **SQL**:書籍を使って学習中　←現在！！！

### 技術学習ロードマップ(2026年7月〜)
※私のプロンプトからClaudeに設計してもらっています。ペースは週31時間想定。

#### 目指す姿

データ基礎(Python/SQL/数値計算/統計)を共通の土台とし、そこから2つの方向へ展開する。

- **Aトラック(プロダクト/LLM):** 顧客との対話にも強く、ML/データサイエンスをコアにLLM・プロダクト実装(C#/Rust)まで担うMLエンジニア
- **Bトラック(推論最適化/SRE):** 画像・動画AIの推論を高速化・軽量化し、GPUリソース制御やSRE的な信頼性設計まで踏み込むAI推論最適化エンジニア

まず共通土台を固め、その後は状況に応じてどちらか(または両方)へ進む。

#### 共通土台(Phase 0〜2)

| Phase | 内容 | 目安時間 | 教材 |
|---|---|---|---|
| **Phase 0(現在)** | **Python基礎の底上げ(型ヒント・デコレータ・OOP・例外処理・pytest) + SQL基礎 + Git補強(ブランチ・PR・issue)** | **30〜40h** | **Udemy[「現役シリコンバレーエンジニアが教えるPython 3 入門 + 応用 +アメリカのシリコンバレー流コードスタイル」](https://www.udemy.com/course/python-beginner/)(Python基礎パート)、SQLは[「SQL 第2版 ゼロからはじめるデータベース操作」](https://www.shoeisha.co.jp/book/detail/9784798144450)で自己学習** |
| Phase 1 | SQL(実践: JOIN・サブクエリ・集計関数) + pandas/numpy(データ抽出・分析) + テーブル設計/正規化・ER図の基礎 | 50〜60h | SQLは[「SQL 第2版 ゼロからはじめるデータベース操作」](https://www.shoeisha.co.jp/book/detail/9784798144450)継続、pandasは[「Python データ分析 & 機械学習 ～パーフェクトスターターコース」](https://www.udemy.com/course/kagglepython/)検討中、DB設計は「達人に学ぶDB設計 徹底指南書」、NumPyは公式「NumPy: the absolute basics」 |
| Phase 2a | 数学の学び直し(高校数学の必要範囲: 関数・指数/対数・微分積分の基礎・確率・数列・ベクトル) | 30〜40h | 「やさしい高校数学(数I・A)」「やさしい高校数学(数II・B)」(きさらぎひろし)で高校範囲を独学、または[「本当にわかる、AI時代の数学【超初心者からの数学入門】」](https://www.udemy.com/course/ai-math-introduction/)で必要範囲だけ速習 |
| Phase 2b | 統計・線形代数の基礎(Phase1と並走) | 30〜40h | 統計は「完全独習 統計学入門」(小島寛之)、ML向けの微積・線形代数・確率は「最短コースでわかる ディープラーニングの数学」(涌井良幸・涌井貞美)、線形代数を深めるなら「プログラミングのための線形代数」(平岡・堀) |

**共通土台の合計: 約140〜180h(週31hで約5〜6週間)**

> **並走目標: 統計検定2級**（CBTで通年受験可・約100h）。ただし統計は高校数学の土台が前提のため、**Phase 2a(数学の学び直し)を済ませてから本格化**する。まずは「完全独習 統計学入門」(小島寛之)や無料の[統計WEB「統計学の時間」](https://bellcurve.jp/statistics/course/)でやさしく入り、そのうえで「統計検定2級公式問題集」で演習。「統計学入門」(東大出版会・通称"赤本")は理論を深めたくなった時のリファレンス(初手には難度高め)。負荷が過大なら全体を2〜3週間後ろ倒し。

#### Aトラック(プロダクト/LLM)

| Phase | 内容 | 目安時間 | 教材 |
|---|---|---|---|
| A-1 | 古典的機械学習(scikit-learn) | 60〜80h | [「Python データ分析 & 機械学習 ～パーフェクトスターターコース」](https://www.udemy.com/course/kagglepython/)検討中 |
| A-2 | 深層学習の基礎(PyTorch) | 80〜100h | 「ゼロから作るDeep Learning」(斎藤康毅) |
| A-3 | LLMエンジニアリングの体系化 | 40〜60h | 未定 |
| A-4 | プロダクト実装言語(C#/Rust) | 60〜100h | 未定 |

**Aトラック合計: 約240〜340h(週31hで約8〜11週間)**

#### Bトラック(推論最適化/SRE)

| Phase | 内容 | 目安時間 | 教材 |
|---|---|---|---|
| B-1 | 画像処理・AI推論の基礎(OpenCV + PyTorch/Vision Transformer) | 60〜80h | 「作りながら学ぶ！PyTorchによる発展ディープラーニング」、ViT原論文「An Image is Worth 16x16 Words」の解説 |
| B-2 | GPU高速化・モデル軽量化(PyTorch→ONNX→TensorRT、量子化 FP32/FP16/INT8) | 60〜80h | NVIDIA公式「TensorRT Developer Guide」、PyTorch公式「Quantization」 |
| B-3 | GPUリソース制御・Docker/SRE冗長化(CUDA Stream、Docker×GPU、Graceful Degradation) | 40〜60h | 「SRE サイトリライアビリティエンジニアリング」、「Docker/Kubernetes 実践コンテナ開発入門」、CUDA C++ Programming Guide(Streams章) |

**Bトラック合計: 約160〜220h(週31hで約5〜7週間)**

> Aトラックの A-2(PyTorch) と Bトラックの B-1(PyTorch/ViT) は PyTorch 基礎を共有するため、両トラックへ進む場合はここが橋渡しになる。

**現在地: 共通土台 Phase 0(Udemy[「現役シリコンバレーエンジニアが教えるPython 3 入門 + 応用 +アメリカのシリコンバレー流コードスタイル」](https://www.udemy.com/course/python-beginner/)進行中、SQLは[「SQL 第2版 ゼロからはじめるデータベース操作」](https://www.shoeisha.co.jp/book/detail/9784798144450)で並行)**

#### 学習ログの運用

- **平日**: 自己ホストブログにその日の理解を書く(まとまってなくてもOK)→ Claudeにコード・ロジック面を添削してもらう → Geminiに概念・理解面を添削してもらう → 二つの指摘を踏まえて認識のズレを訂正としてまとめる。意見が割れた場合はそのまま明記して保留
- **休日**: 平日ログの中から自信を持って理解できたものだけをZennに技術ナレッジとしてまとめる