require "yast2/installer_client"

class ApplicationController < ActionController::API
  def installer_client
    @client ||= Yast2::InstallerClient.new
  end
end
