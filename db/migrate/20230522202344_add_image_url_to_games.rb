class AddImageUrlToGames < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :image_url, :string
  end
end
