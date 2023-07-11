class HighlightsController < ApplicationController
    wrap_parameters format: []
    before_action :authorize
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  
    def index
      highlights = Highlight.order(created_at: :desc)
      render json: highlights, status: :ok
    end

    def userIndex
        user = User.find_by(id: session[:user_id])
        highlights = user.highlights.order(created_at: :desc)
        render json: highlights, status: :ok
      end
  
    def show
      highlight = find_highlight
      render json: highlight, status: :ok
    end
  
    def create
       user = User.find_by(id: session[:user_id])
       highlight = user.highlights.create!(highlight_params)
       render json: highlight, status: :created
      end
  
    def update
      user = User.find_by(id: session[:user_id])
      highlight = find_highlight
      if user.id == highlight.user_id
        if highlight.update(highlight_params)
          render json: highlight, status: :ok
        else
          render json: { errors: highlight.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { error: "You are not authorized to update this highlight" }, status: :unauthorized
      end
      
    end

    def destroy
      highlight = find_highlight
      user = User.find_by(id: session[:user_id])
      # Check if the current user is the owner of the highlight
      if user.id == highlight.user_id
        highlight.destroy
        head :no_content
      else
        render json: { error: "You are not authorized to delete this highlight" }, status: :unauthorized
      end
    end

    def show_user_highlights
      highlights = @user.highlights.filter{|h| h.title.downcase.include? "fun"}
      render json: highlights

    end

    # def destroyAll
    #   Highlight.destroy_all
    #   head :no_content
    # end


    
  
    private
    def authorize
      user = User.find_by(id: session[:user_id])
      render json: {error: "Not authorized"}, status: :unauthorized unless user
    end
    def highlight_params
      params.permit(:id, :title, :description, :video_url, :user_id, :game_id)
    end
  
    def find_highlight
      Highlight.find(params[:id])
    end

    def render_unprocessable_entity(invalid)
      render json: { errors: invalid.record.errors.full_messages }, status: :unprocessable_entity
    end
  end
