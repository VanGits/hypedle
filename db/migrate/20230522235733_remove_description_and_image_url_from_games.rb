class RemoveDescriptionAndImageUrlFromGames < ActiveRecord::Migration[6.1]
  def change
    remove_column :games, :description, :text
    remove_column :games, :image_url, :string
  end
end
