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

# YaST specific code lives under this namespace
module Yast2
  class InstallerStatus
    class << self
      # Returns all the possible installer statuses
      #
      # @return [Array<InstallerStatus>] Installer status
      def all
        @all ||= self.constants
          .map { |c| InstallerStatus.const_get(c) }
          .select { |c| c.is_a?(InstallerStatus) }
      end
    end

    attr_reader :id, :name

    def initialize(id, name)
      @id = id
      @name = name
    end

    IDLE = new(0, "Idle")
    PARTITIONING = new(1, "Partitioning")
    INSTALLING = new(2, "Installing")
    FINISHED = new(3, "Finished")
    ERROR = new(4, "Error")
  end
end
