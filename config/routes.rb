Rails.application.routes.draw do
  
 
  post "/login", to: "sessions#create"
  post "/signup", to: "users#create"
  get "/me", to: "users#show"
  delete "/logout", to: "sessions#destroy"
  resources :highlights do
    resources :likes, only:[:index, :create, :destroy]
    resources :comments, only: [:create, :update, :destroy]
    get "/comments", to: "comments#commentsIndex"
  end

  
  # delete "/highlights", to: "highlights#destroyAll"
  # delete "/games", to: "games#destroyAll"
  get "/my-highlights", to: "highlights#userIndex"
  resources :games, only: [:index]
  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
