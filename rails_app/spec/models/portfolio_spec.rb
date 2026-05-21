require 'rails_helper'

RSpec.describe Portfolio, type: :model do
  describe 'バリデーション' do
    it 'タイトルと説明文があれば有効であること' do
      portfolio = Portfolio.new(title: 'My App', description: '説明です')
      expect(portfolio).to be_valid
    end

    it 'タイトルがなければ無効であること' do
      portfolio = Portfolio.new(title: nil, description: '説明です')
      portfolio.valid?
      expect(portfolio.errors[:title]).to include("can't be blank")
    end

    it '説明文がなければ無効であること' do
      portfolio = Portfolio.new(title: 'My App', description: nil)
      portfolio.valid?
      expect(portfolio.errors[:description]).to include("can't be blank")
    end
  end

  describe 'スコープ' do
    describe '.recent' do
      it '作成日時の新しい順（降順）に取得できること' do
        old_portfolio = Portfolio.create!(title: '古い作品', description: '...', created_at: 1.day.ago)
        new_portfolio = Portfolio.create!(title: '新しい作品', description: '...', created_at: Time.current)
        
        expect(Portfolio.recent).to eq([new_portfolio, old_portfolio])
      end
    end
  end
end
