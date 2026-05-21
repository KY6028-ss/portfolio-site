require 'rails_helper'

RSpec.describe Profile, type: :model do
  describe 'バリデーション' do
    it '名前(name)があれば有効であること' do
      profile = Profile.new(name: 'テストエンジニア', bio: 'こんにちは')
      expect(profile).to be_valid
    end

    it '名前(name)がなければ無効であること' do
      profile = Profile.new(name: nil)
      profile.valid?
      expect(profile.errors[:name]).to include("can't be blank") # デフォルトエラーメッセージの場合
    end
  end

  describe 'クラスメソッド: current' do
    context 'レコードが存在しない場合' do
      it 'デフォルトのプロフィールが作成されること' do
        expect { Profile.current }.to change { Profile.count }.by(1)
        expect(Profile.current.name).to eq 'あなたの名前'
      end
    end

    context 'レコードがすでに存在する場合' do
      before { Profile.create!(name: '既存のユーザー', bio: '既存の自己紹介') }

      it '最初のレコードが返されること' do
        expect { Profile.current }.not_to change { Profile.count }
        expect(Profile.current.name).to eq '既存のユーザー'
      end
    end
  end
end
