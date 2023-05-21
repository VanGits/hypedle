class HighlightSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :video_url, :user_id, :game_id
end
