class Like < ApplicationRecord
    belongs_to :user
    belongs_to :highlight
    validates :user_id, presence: true, uniqueness: { scope: :highlight_id }
  end