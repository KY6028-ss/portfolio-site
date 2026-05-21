require 'rails_helper'

RSpec.describe Blog, type: :model do
  describe 'スコープのテスト' do
    describe '.published' do
      it '公開日時が過去の記事のみを取得できること' do
        published_blog = Blog.create!(title: 'Rubyの記事', content: '内容', published_at: 1.day.ago)
        draft_blog = Blog.create!(title: '下書き', content: '内容', published_at: 1.day.from_now)

        result = Blog.published

        expect(result).to include(published_blog)
        expect(result).not_to include(draft_blog)
      end
    end
  end
end