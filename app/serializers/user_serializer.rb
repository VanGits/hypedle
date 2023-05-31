class UserSerializer < ActiveModel::Serializer
  has_many :highlights
  has_many :likes
  has_many :comments
  has_many :highlight_comments
  has_many :highlight_likes
  attributes :id, :name, :email, :password_digest, :image_url
end
