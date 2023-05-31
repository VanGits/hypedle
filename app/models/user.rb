class User < ApplicationRecord
    has_secure_password
    has_many :highlights, dependent: :destroy
    has_many :likes, dependent: :destroy
    has_many :comments, dependent: :destroy
    has_many :highlight_comments, through: :comments, source: :highlight
    has_many :highlight_likes, through: :likes, source: :highlight
  
    validates :name, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: true
    validates :password, presence: true, length: { minimum: 6 }
    validates :image_url, presence: true
  end