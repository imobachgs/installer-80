class LanguagesController < ApplicationController
  def index
    @languages ||= Yast2::Installer.instance.languages.map do |id, attrs|
      { id: id, name: attrs[0] }
    end
    render json: { data: @languages }
  end
end
