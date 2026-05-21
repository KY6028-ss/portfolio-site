require 'rails_helper'

RSpec.describe "Announcements", type: :request do
  describe "GET /announcements" do
    it "正常なレスポンスを返し、お知らせのタイトルが含まれていること" do
      Announcement.create!(title: 'テストお知らせ', content: 'テスト内容', published_at: Time.current)
      
      get announcements_path
      
      expect(response).to have_http_status(:success)
      expect(response.body).to include('テストお知らせ')
    end
  end
end