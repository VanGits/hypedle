class HighlightSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :game
  has_many :likes
  has_many :comments
  attributes :id, :title, :description, :video_url, :user_id, :game_id, :created_at, :updated_at
end
