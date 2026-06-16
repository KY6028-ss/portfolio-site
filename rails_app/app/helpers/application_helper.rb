module ApplicationHelper
  include Pagy::Frontend

  # サイト名・既定の説明文。<title> や OGP の既定値として全ページで共有する。
  SITE_NAME = "My Portfolio".freeze
  SITE_DESCRIPTION = "ポートフォリオと技術ブログ。OSS活動や日々の学習記録を発信しています。".freeze

  def markdown(text)
    return "" if text.blank?
    Commonmarker.to_html(text).html_safe
  rescue StandardError
    simple_format(text)
  end

  # 日付を <time datetime="..."> 付きで表示する。
  # nil のときは何も出さない（旧コードの published_at&.strftime のガードを内包）。
  # with_time: true で時刻まで、css_class で見た目クラスを指定できる。
  def format_date(time, with_time: false, css_class: "post-meta")
    return nil if time.nil?

    format = with_time ? "%Y-%m-%d %H:%M" : "%Y-%m-%d"
    tag.time(time.strftime(format), datetime: time.iso8601, class: css_class)
  end

  # <title> の文言。各ビューで content_for(:title, "...") を指定するとサイト名と連結する。
  def page_title
    page = content_for(:title)
    page.present? ? "#{page} | #{SITE_NAME}" : SITE_NAME
  end

  # meta description / OGP の説明文。ビューで content_for(:description, "...") を指定すると上書きされる。
  def meta_description
    content_for(:description).presence || SITE_DESCRIPTION
  end
end
