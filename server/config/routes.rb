Rails.application.routes.draw do
  resources :disks, only: :index
  resources :languages, only: :index
  resources :products, only: :index
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
