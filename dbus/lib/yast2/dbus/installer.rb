# Copyright (c) [2021] SUSE LLC
#
# All Rights Reserved.
#
# This program is free software; you can redistribute it and/or modify it
# under the terms of version 2 of the GNU General Public License as published
# by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
# more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, contact SUSE LLC.
#
# To contact SUSE LLC about this file by physical or electronic mail, you may
# find current contact information at www.suse.com.

require "dbus"

module Yast2
  module DBus
    # YaST D-Bus object (/org/opensuse/YaST/Installer)
    #
    # @see https://rubygems.org/gems/ruby-dbus
    class Installer < ::DBus::Object
      attr_reader :installer

      # @param installer [Yast2::Installer] YaST installer instance
      # @param args [Array<Object>] ::DBus::Object arguments
      def initialize(installer, *args)
        @installer = installer
        super(*args)
      end

      dbus_interface "org.opensuse.YaST.Installer" do
        dbus_method :GetLanguages, "out langs:a{sas}" do
          [installer.languages]
        end

        dbus_method :GetProducts, "out products:aa{ss}" do
          products = installer.products.map do |product|
            { "name" => product.name, "display_name" => product.display_name }
          end
          [products]
        end

        dbus_method :GetStorage, "out proposal:aa{ss}" do
          proposal = installer.storage_proposal.filesystems.map do |fs|
            blk_device = fs.blk_devices.first
            {
              "mount"  => fs.mount_point&.path,
              "device" => blk_device.name,
              "type"   => fs.type&.to_s,
              "size"   => blk_device.size.to_i.to_s
            }
          end
          [proposal]
        end
      end
    end
  end
end
