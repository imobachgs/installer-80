require "yast"
require "yast2/installer_options"
require "y2packager/product"
require "y2storage"
Yast.import "CommandLine"

# YaST specific code lives under this namespace
module Yast2
  # This class represents the installer itself
  #
  # It is responsible for orchestrating the installation process. Additionally,
  # it serves as an entry point to other APIs.
  class Installer
    class << self
      def create_instance
        @instance = new
      end

      def instance
        @instance ||= create_instance
      end
    end

    attr_reader :options

    def initialize
      Yast::Mode.SetUI("commandline")
      @options = Yast2::InstallerOptions.new
    end

    # Return the list of known products
    #
    # @return [Array<Y2Packager::Product>] List of known products
    def products
      @products ||= Y2Packager::Product.all
    end

    # Returns the list of known languages
    #
    # @return [Hash]
    def languages
      return @languages if @languages

      Yast.import "Language"
      @languages = Yast::Language.GetLanguagesMap(true)
    end

    # Starts the probing process
    #
    # At this point, it just initializes some YaST modules/subsystems:
    #
    # * Software management
    # * Simplified storage probing
    #
    # The initialization of these subsystems should probably live in a different place.
    def probe
      probe_software
      probe_storage
    end

    def propose
      propose_storage
    end

    def disk_name
      @disk_name ||= storage_manager.probed.disks.first&.name
    end

    def disk_name=(name)
      @disk_name = name
      propose_storage
    end

    def disks
      storage_manager.probed.disks
    end

    def storage_probed
      storage_manager.probed
    end

    def storage_proposal
      storage_manager.proposal&.devices
    end

    private

    def probe_software
      Yast.import 'Pkg'
      Yast.import 'PackageLock'
      Yast::Pkg.TargetInitialize('/')
      Yast::Pkg.TargetLoad
      Yast::Pkg.SourceRestore
      Yast::Pkg.SourceLoad
    end

    def probe_storage
      storage_manager.probe
    end

    def propose_storage
      return unless disk_name

      settings = Y2Storage::ProposalSettings.new_for_current_product
      settings.candidate_devices = [disk_name]

      # FIXME: clean up the disks
      clean_probed = storage_probed.clone
      clean_probed.disks.each(&:remove_descendants)

      proposal = Y2Storage::GuidedProposal.initial(
        devicegraph: clean_probed,
        settings: settings
      )
      storage_manager.proposal = proposal
    end

    def storage_manager
      @storage_manager ||= Y2Storage::StorageManager.instance
    end
  end
end
