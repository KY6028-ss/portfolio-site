require 'rails_helper'

RSpec.describe "Blogs", type: :request do
  describe "GET /blogs" do
    it "公開済みブログのタイトルが表示されること" do
      Blog.create!(title: '公開記事', content: '本文', published_at: 1.day.ago)

      get blogs_path

      expect(response).to have_http_status(:success)
      expect(response.body).to include('公開記事')
    end

    it "未公開（published_at が未来）のブログは表示されないこと" do
      Blog.create!(title: '予約投稿', content: '本文', published_at: 1.day.from_now)

      get blogs_path

      expect(response.body).not_to include('予約投稿')
    end

    context "Pagy によるページネーション" do
      before do
        12.times { |i| Blog.create!(title: "記事#{i}", content: '本文', published_at: (i + 1).days.ago) }
      end

      it "1ページ目はページネーションnavを表示すること（1ページ10件 < 全12件）" do
        get blogs_path

        expect(response).to have_http_status(:success)
        expect(response.body).to include('pagy')
      end

      it "2ページ目もリクエストできること" do
        get blogs_path, params: { page: 2 }

        expect(response).to have_http_status(:success)
      end
    end
  end
end
