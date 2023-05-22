class Game < ApplicationRecord
    has_many :highlights, dependent: :destroy
    validates :title, presence: true, uniqueness: true
    validates :description, presence: true, uniqueness: true
end
