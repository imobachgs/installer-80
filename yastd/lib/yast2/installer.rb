require "yast"
require "y2packager/product"
require "y2storage"
require "yast2/installer_status"
require "yast2/dbus/installer_client"
Yast.import "CommandLine"

# YaST specific code lives under this namespace
module Yast2
  # This class represents the installer itself
  #
  # It is responsible for orchestrating the installation process. Additionally,
  # it serves as an entry point to other APIs.
  class Installer
    class InvalidValue < StandardError; end

    DEFAULT_LANGUAGE = "en_US".freeze

    attr_reader :disks, :languages, :products
    attr_reader :disk, :product
    attr_reader :logger
    attr_accessor :language

    # @return [InstallerStatus]
    attr_accessor :status

    def initialize
      Yast::Mode.SetUI("commandline")
      Yast::Mode.SetMode("installation")
      @disks = []
      @languages = []
      @products = []
      @status = InstallerStatus::IDLE.id
      @status_handler = nil
      @dbus_client = Yast2::DBus::InstallerClient.new
      @logger = Logger.new(STDOUT)
    end

    def options
      { "disk" => disk, "product" => product, "language" => language }
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
      probe_languages
      probe_software
      probe_storage
    end

    def disk=(name)
      raise InvalidValue unless propose_storage(name)

      @disk = name
    end

    def product=(name)
      raise InvalidValue unless products.map(&:name).include?(name)

      @product = name
    end

    def language=(name)
      raise InvalidValue unless languages.include?(name)

      @language = name
    end

    def storage_proposal
      storage_manager.proposal&.devices
    end

    def install
      Yast::Installation.destdir = "/mnt"
      logger.info "Installing(partitioning)"
      change_status(InstallerStatus::PARTITIONING)
      # Yast::WFM.CallFunction(["inst_prepdisk"], [])
      sleep 5
      # Install software
      logger.info "Installing(installing software)"
      change_status(InstallerStatus::INSTALLING)
      sleep 5
      logger.info "Installing(finished)"
      change_status(InstallerStatus::IDLE)
    end

    private

    attr_reader :dbus_client

    def change_status(status)
      dbus_client.status = status.id
    end

    def probe_software
      Yast.import 'Pkg'
      Yast.import 'PackageLock'
      Yast::Pkg.TargetInitialize('/')
      Yast::Pkg.TargetLoad
      Yast::Pkg.SourceRestore
      Yast::Pkg.SourceLoad
      @products = Y2Packager::Product.all
      @product = @products.first&.name
    end

    # Returns the list of known languages
    #
    # @return [Hash]
    def probe_languages
      Yast.import "Language"
      @languages = Yast::Language.GetLanguagesMap(true)
      self.language = DEFAULT_LANGUAGE
    end

    def probe_storage
      storage_manager.probe
      @disks = storage_manager.probed.disks
      self.disk = @disks.first&.name
    end

    # @return [Boolean] true if success; false if failed
    def propose_storage(disk_name)
      settings = Y2Storage::ProposalSettings.new_for_current_product
      settings.candidate_devices = [disk_name]

      # FIXME: clean up the disks
      clean_probed = storage_probed.clone
      clean_probed.disks.each(&:remove_descendants)

      proposal = Y2Storage::GuidedProposal.initial(
        devicegraph: clean_probed,
        settings: settings
      )
      return false if proposal.failed?
      storage_manager.proposal = proposal
      true
    end

    def storage_probed
      storage_manager.probed
    end

    def storage_manager
      @storage_manager ||= Y2Storage::StorageManager.instance
    end
  end
end
