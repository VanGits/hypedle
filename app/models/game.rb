class Game < ApplicationRecord
    has_many :highlights, dependent: :destroy
end
