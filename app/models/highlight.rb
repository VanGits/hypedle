class Highlight < ApplicationRecord
    belongs_to :user
    belongs_to :game
    has_many :likes, dependent: :destroy
    has_many :comments, dependent: :destroy
    has_many :commenting_users, through: :comments, source: :user
    has_many :liked_users, through: :likes, source: :user
  
    validates :title, presence: true, length: { maximum: 16 }
    validates :description, presence: true
    validates :video_url, presence: true, format: { with: /\Ahttps?:\/\/\S+\z/ }
  end
