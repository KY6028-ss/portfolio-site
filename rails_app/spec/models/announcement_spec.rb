require 'rails_helper'

RSpec.describe Announcement, type: :model do
  describe 'バリデーションのテスト' do
    it 'タイトルとコンテンツがあれば有効であること' do
      announcement = Announcement.new(title: 'サイト公開', content: 'ポートフォリオを作りました。', published_at: Time.current)
      expect(announcement).to be_valid
    end

    it 'タイトルが空の場合は無効であること' do
      announcement = Announcement.new(title: nil, content: '内容')
      expect(announcement).to be_invalid
    end
  end

  describe 'スコープのテスト' do
    it 'publishedスコープが「公開済み」のものだけを返すこと' do
      published_announcement = Announcement.create!(title: '公開', content: '内容', published_at: 1.day.ago)
      draft_announcement = Announcement.create!(title: '未公開', content: '内容', published_at: 1.day.from_now)

      expect(Announcement.published).to include(published_announcement)
      expect(Announcement.published).not_to include(draft_announcement)
    end
  end
end