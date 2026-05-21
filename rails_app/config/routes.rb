Rails.application.routes.draw do
  resource :profile, only: [:show] do
    post :chat, on: :collection
  end
  resources :announcements, only: [:index, :show]
  resources :portfolios, only: [:index, :show]
  resources :blogs, only: [:index, :show]
end