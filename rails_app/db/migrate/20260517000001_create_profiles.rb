class CreateProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :profiles do |t|
      t.string :name, null: false
      t.text :bio
      t.text :site_description

      t.timestamps
    end
  end
end
