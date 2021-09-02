class ProductsController < ApplicationController
  def index
    render json: { data: installer_client.products }
  end
end
