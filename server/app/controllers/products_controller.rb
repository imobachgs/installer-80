class ProductsController < ApplicationController
  def index
    @products = Yast2::Installer.instance.products
    render json: { data: @products }
  end
end
