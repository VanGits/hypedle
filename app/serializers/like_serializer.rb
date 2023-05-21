class LikeSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :highlight_id
end
