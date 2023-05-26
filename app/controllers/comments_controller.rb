class CommentsController < ApplicationController

    def commentsIndex 
        highlight = find_highlight
        comments = highlight.comments.order(created_at: :desc)
        render json: comments, status: :ok
    end

    def create
        comment = @user.comments.create!(comment_params)
        render json: comment, status: :created
    end

    def update
        comment = find_comment
        comment.update(comment_params)
          render json: comment, status: :ok
        
      end

      def destroy
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

      def find_highlight
        Highlight.find(params[:highlight_id])
      end
end
