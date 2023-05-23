class GamesController < ApplicationController

    def index
        games = Game.all
        render json: games, status: :ok
    end

    def destroyAll
      
        Game.destroy_all
        head :no_content
      end
end
