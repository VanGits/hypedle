class LikesController < ApplicationController
    wrap_parameters format: []



    def index
        highlight =  Highlight.find(params[:highlight_id])
        
        likes = highlight.likes
        render json: likes, status: :ok
    end

    def create
        highlight = Highlight.find(params[:highlight_id])
        like = highlight.likes.create!(likes_params)
        render json: like, status: :created
    end

    def destroy
        like = find_like
        
      
        if @user.id == like.user_id
          like.destroy
          head :no_content
        else
          render json: { error: "You are not authorized to unlike this" }, status: :unauthorized
        end
      end


    private

    def find_like
        Like.find(params[:id])
    end

    def likes_params
        params.permit(:user_id, :highlight_id)
    end

   
    
   
    
end
