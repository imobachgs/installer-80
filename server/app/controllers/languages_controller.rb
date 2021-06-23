class LanguagesController < ApplicationController
  def index
    @languages ||= Yast2::Installer.instance.languages
    render json: { data: @languages }
  end
end
