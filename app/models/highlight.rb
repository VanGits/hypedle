class Highlight < ApplicationRecord
    belongs_to :user
    belongs_to :game
    has_many :likes, dependent: :destroy
    has_many :comments, dependent: :destroy
end
