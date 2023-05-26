class HighlightsController < ApplicationController
    wrap_parameters format: []

    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  
    def index
      highlights = Highlight.order(created_at: :desc)
      render json: highlights, status: :ok
    end

    def userIndex
        highlights = @user.highlights.order(created_at: :desc)
        render json: highlights, status: :ok
      end
  
    def show
      highlight = find_highlight
      render json: highlight, status: :ok
    end
  
    def create
       highlight = @user.highlights.create!(highlight_params)
       render json: highlight, status: :created
      end
  
    def update
      highlight = find_highlight
      highlight.update(highlight_params)
        render json: highlight, status: :ok
      
    end

    def destroy 
      highlight = find_highlight
      highlight.delete
      head :no_content
    end

    # def destroyAll
    #   Highlight.destroy_all
    #   head :no_content
    # end


    
  
    private
  
    def highlight_params
      params.permit(:title, :description, :video_url, :user_id, :game_id)
    end
  
    def find_highlight
      Highlight.find(params[:id])
    end

    def render_unprocessable_entity(invalid)
      render json: { errors: invalid.record.errors.full_messages }, status: :unprocessable_entity
    end
  end
