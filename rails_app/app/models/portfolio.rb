class Portfolio < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true

  scope :recent, -> { order(created_at: :desc) }
end