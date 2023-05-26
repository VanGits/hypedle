class CommentsController < ApplicationController

    def create
        comment = @user.comments.create!(comment_params)
        render json: comment, status: :created
    end

    def update
        comment = find_comment
        comment.update(comment_params)
          render json: comment, status: :ok
        
      end

      def delete
        comment = find_comment
        comment.delete
        head :no_content
      end

    private

    def comment_params
        params.permit(:content, :user_id, :highlight_id)
    end

    def find_comment
        Comment.find(params[:id])
      end
end
