class HighlightsController < ApplicationController

    wrap_parameters format:[]

    def index
        highlights = Highlight.all
        render json: highlights, status: :ok
    end

    def show
        
    end

    def create
        highlight = Highlight.create(highlight_params)
        render json: highlight, status: :created
    end

    def update

    end

    def delete

    end

    private

    def highlight_params
        params.permit(:title, :description, :video_url, :user_id, :game_id)
    end
end
