class CommentSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :highlight
  attributes :id, :content, :user_id, :highlight_id
end
