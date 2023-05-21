class LikeSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :highlight
  attributes :id, :user_id, :highlight_id
end
