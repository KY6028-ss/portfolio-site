class Blog < ApplicationRecord
  validates :title, presence: true
  validates :content, presence: true

  scope :published, -> { where('published_at <= ?', Time.current) }
  scope :recent, -> { order(published_at: :desc) }
end