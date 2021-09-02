class StorageController < ApplicationController
  def show
    # TODO
    # probed = Yast2::Installer.instance.storage_probed
    # disks = probed.disks.map { |d| { name: d.name, model: d.model } }
    # proposal = Yast2::Installer.instance.storage_proposal
    # disk_name = Yast2::Installer.instance.disk_name

    # render json: { data: { proposal: simple_devicegraph(proposal), disks: disks, disk: disk_name } }
  end

  def update
    disk_name = params.require(:disk)
    Yast2::Installer.instance.disk_name = disk_name
    proposal = Yast2::Installer.instance.storage_proposal
    render json: { data: { proposal: simple_devicegraph(proposal) }}
  end

  private

  # FIXME: use a Serializer (?)
  def simple_devicegraph(devicegraph)
    devicegraph.filesystems.map do |fs|
      # FIXME: do not support multi devices
      blk_device = fs.blk_devices.first
      {
        mount: fs.mount_point&.path,
        device: blk_device.name,
        type: fs.type&.to_s,
        size: blk_device.size.to_i
      }
    end
  end
end
