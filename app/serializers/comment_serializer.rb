class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :user_id, :highlight_id
end
