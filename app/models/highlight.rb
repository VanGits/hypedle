class Highlight < ApplicationRecord
    belongs_to :user
    belongs_to :game
    has_many :likes, dependent: :destroy
    has_many :comments, dependent: :destroy
    validates :title, presence: true, length: {maximum: 16}
    validates :description, presence: true
    validates :video_url, presence: true, format: { with: /\Ahttps?:\/\/\S+\z/ }
    validates :user_id, presence: true
    validates :game_id, presence: true
   
end
