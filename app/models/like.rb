class Like < ApplicationRecord
    belongs_to :user
    belongs_to :highlight
    validates :user_id, presence: true
    validates :highlight_id, presence: true
    validates :user_id
end
