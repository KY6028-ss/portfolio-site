class Profile < ApplicationRecord
  validates :name, presence: true

  def self.current
    first || create!(name: "あなたの名前", bio: "自己紹介文をここに入力", site_description: "ポートフォリオサイトの趣旨")
  end
end