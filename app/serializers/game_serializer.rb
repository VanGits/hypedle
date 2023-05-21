class GameSerializer < ActiveModel::Serializer
  has_many :highlights
  attributes :id, :title, :description
end
