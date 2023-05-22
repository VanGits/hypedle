class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :highlight
    validates :content, presence: true
    validates :user_id, presence: true
    validates :highlight_id, presence: true
end
