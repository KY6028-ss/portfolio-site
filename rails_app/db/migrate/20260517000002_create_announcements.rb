class CreateAnnouncements < ActiveRecord::Migration[7.0]
  def change
    create_table :announcements do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.datetime :published_at

      t.timestamps
    end
  end
end
