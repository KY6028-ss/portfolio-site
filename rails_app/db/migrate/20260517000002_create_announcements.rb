class CreateAnnouncements < ActiveRecord::Migration[8.1]
  def change
    create_table :announcements do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.datetime :published_at

      t.timestamps
    end
  end
end
