#
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
    class InstallerClient

      SERVICE_NAME = "org.opensuse.YaST".freeze
      OBJECT_PATH = "/org/opensuse/YaST/Installer".freeze
      IFACE = "org.opensuse.YaST.Installer".freeze

      def status=(id)
        installer_obj["org.freedesktop.DBus.Properties"].Set(
          IFACE, "Status", id
        )
      end

    private

      def installer_obj
        return @installer_obj if @installer_obj

        bus = ::DBus::SystemBus.instance
        service = bus.service(SERVICE_NAME)
        @installer_obj = service.object(OBJECT_PATH)
        @installer_obj.default_iface = IFACE
        @installer_obj
      end
    end
  end
end
