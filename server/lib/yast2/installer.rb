require "yast"
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

    def initialize
      Yast::Mode.SetUI("commandline")
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
      manager = Y2Storage::StorageManager.instance
      manager.probe
    end
  end
end
