class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :highlight
    validates :content, presence: true
  end
