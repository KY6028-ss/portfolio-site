# プロフィール作成
Profile.current.update!(
  name: "山田 太郎",
  bio: "フルスタックエンジニアを目指して勉強中のエンジニアです。\nRuby on RailsとPythonを中心に、Webアプリケーションの開発を行っています。",
  site_description: "このサイトは、私の学習の成果や制作したポートフォリオを共有するための場所です。"
)

# ポートフォリオ作成
Portfolio.create!([
  { title: "AIチャットボット", description: "FastAPIとLangChainを使用したRAGチャットボットです。", url: "https://github.com/example/ai-chat" },
  { title: "ECサイト", description: "Rails 8を使用したシンプルなECサイトです。", url: "https://github.com/example/ecommerce" }
])

# ブログ記事作成
Blog.create!([
  { title: "Rails 8の新機能について", content: "Rails 8ではSolid CacheやSolid Queueが標準搭載されました。これによって外部ミドルウェアへの依存を減らすことができます...", published_at: Time.current },
  { title: "FastAPIでのAPI開発", content: "FastAPIは型ヒントを活用した高速な開発が可能です。PythonでのAPI開発において非常に強力な選択肢となります。", published_at: 1.day.ago }
])

# お知らせ作成
Announcement.create!([
  { title: "ポートフォリオサイトを公開しました", content: "本日、新しくポートフォリオサイトを公開しました！", published_at: Time.current }
])
