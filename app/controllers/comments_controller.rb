class CommentsController < ApplicationController

  wrap_parameters format: []

    def index 
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
    
     
      if @user.id == comment.user_id
        if comment.update(comment_params)
          render json: comment, status: :ok
        else
          render json: { error: "Failed to update comment" }, status: :unprocessable_entity
        end
      else
        render json: { error: "You are not authorized to update this comment" }, status: :unauthorized
      end
    end

    def destroy
      comment = find_comment
    
      
      if @user.id == comment.user_id
        comment.destroy
        head :no_content
      else
        render json: { error: "You are not authorized to delete this comment" }, status: :unauthorized
      end
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
