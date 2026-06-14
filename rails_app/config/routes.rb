Rails.application.routes.draw do
  # ヘルスチェック用エンドポイント（Docker healthcheck から参照）
  get "up" => "rails/health#show", as: :rails_health_check

  resource :profile, only: [:show] do
    post :chat, on: :collection
  end
  resources :announcements, only: [:index, :show]
  resources :portfolios, only: [:index, :show]
  resources :blogs, only: [:index, :show]
end