class CreateHighlights < ActiveRecord::Migration[6.1]
  def change
    create_table :highlights do |t|
      t.string :title
      t.text :description
      t.string :video_url
      t.integer :user_id
      t.integer :game_id

      t.timestamps
    end
  end
end
