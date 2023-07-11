Rails.application.routes.draw do
  
 
  post "/login", to: "sessions#create"
  post "/signup", to: "users#create"
  get "/me", to: "users#show"
  delete "/logout", to: "sessions#destroy"
  resources :highlights do
    resources :likes, only:[:index, :create, :destroy]
    resources :comments
    # get "/comments", to: "comments#commentsIndex"
  end

  ## new route called "/fun-highlights" that belongs to the logged in user
  ## if i go to that route, i want to see any highlights that have "fun" in the title
  ## render json

  ## create custom route
  ## hit highlights controller with the action of show_user_highlights
  ## 

  get "/fun-highlights", to: "highlights#show_user_highlights"



  
  # delete "/highlights", to: "highlights#destroyAll"
  # delete "/games", to: "games#destroyAll"
  get "/my-highlights", to: "highlights#userIndex"
  resources :games, only: [:index]
  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
  
end
