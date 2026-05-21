class CreatePortfolios < ActiveRecord::Migration[7.0]
  def change
    create_table :portfolios do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :url
      t.string :image_url

      t.timestamps
    end
  end
end