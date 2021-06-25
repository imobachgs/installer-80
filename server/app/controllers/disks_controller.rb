require "y2storage"

class DisksController < ApplicationController
  def index
    probed = Y2Storage::StorageManager.instance.probed
    @disks = probed.disks.map { |d| { name: d.name, model: d.model } }
    render json: { data: @disks }
  end
end
